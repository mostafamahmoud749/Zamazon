import { Request, Router } from 'express';
import passport from 'passport';
import { hashPassword } from '../utils/helpers.js';
import { CreateUserDto } from '../dtos/User.dto.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { RegisterSchema } from '../schemas/Auth.schema.js';
import { validateLogin } from '../middleware/validateLogin.js';

const router = Router();

router.post('/api/auth/login', validateLogin, passport.authenticate('local'), (_, response) => {
  response.sendStatus(200);
});

router.post('/api/auth/register', async (request: Request<{}, {}, CreateUserDto>, response) => {
  const bodyResult = RegisterSchema.safeParse(request.body);

  if (!bodyResult.success) {
    return response.status(400).json({
      error: 'Invalid registration data',
      details: bodyResult.error.flatten(),
    });
  }

  const { password, email, name } = bodyResult.data;

  try {
    const hasedpasswrod = hashPassword(password);
    const savedUser = await prisma.user.create({
      data: {
        password: hasedpasswrod,
        email,
        name,
      },
    });

    response.status(201).send(savedUser);
  } catch (err) {
    response.sendStatus(400);
  }
});

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
