import { Request, Router } from 'express';
import passport from 'passport';
import { rateLimit } from 'express-rate-limit';
import { hashPassword } from '../utils/helpers.js';
import { CreateUserDto } from '../dtos/User.dto.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { RegisterSchema, LoginSchema } from '../../schemas/Auth.schema.js';
import { validateBody } from '../middleware/validateBody.js';
import { isPrismaError } from '../utils/isPrismaError.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
});

router.post(
  '/api/auth/login',
  loginLimiter,
  validateBody(LoginSchema),
  passport.authenticate('local'),
  (_, response) => {
    response.sendStatus(200);
  },
);

router.post(
  '/api/auth/register',
  validateBody(RegisterSchema),
  async (request: Request<{}, {}, CreateUserDto>, response) => {
    const { password, email, name } = request.body;

    try {
      const hashedPassword = await hashPassword(password);
      const savedUser = await prisma.user.create({
        data: {
          password: hashedPassword,
          email,
          name,
        },
      });

      response.status(201).send({ name: savedUser.name, email: savedUser.email });
    } catch (err) {
      if (isPrismaError(err, 'P2002')) {
        return response.status(409).json({ error: 'Email already exists' });
      }

      throw err;
    }
  },
);

router.get('/api/auth/github', passport.authenticate('github'));

router.get('/api/auth/github/callback', passport.authenticate('github'), (_, response) => {
  response.redirect('http://localhost:3000');
});

export default router;
