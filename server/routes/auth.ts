import { Request, Router } from 'express';
import passport from 'passport';
import { hashPassword } from '../utils/helpers.js';
import { CreateUserDto } from '../dtos/User.dto.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { RegisterSchema, LoginSchema } from '../schemas/Auth.schema.js';
import { validateBody } from '../middleware/validateBody.js';
import { Prisma } from '@/generated/prisma/client.js';

const router = Router();

router.post(
  '/api/auth/login',
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
      const hasedpasswrod = hashPassword(password);
      const savedUser = await prisma.user.create({
        data: {
          password: hasedpasswrod,
          email,
          name,
        },
      });

      response.status(201).send({ name: savedUser.name, email: savedUser.email });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        return response.status(409).send({ error: 'Email already exists' });
      }

      response.sendStatus(500);
    }
  },
);

router.get('/api/auth/status', (request, response) => {
  request.isAuthenticated()
    ? response.send({ user: request.user.id, session: request.session })
    : response.sendStatus(401);
});

router.get('/api/auth/github', passport.authenticate('github'));

router.get('/api/auth/github/callback', passport.authenticate('github'), (_, response) => {
  response.sendStatus(200);
});

export default router;
