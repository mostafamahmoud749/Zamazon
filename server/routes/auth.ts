import { Request, Router } from 'express';
import passport from 'passport';
import { hashPassword } from '../utils/helpers.js';
import { createUserDto } from '../dtos/createUser.dto';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.post('/api/auth/login', passport.authenticate('local'), (_, response) => {
  response.sendStatus(200);
});

router.post('/api/auth/register', async (request: Request<{}, {}, createUserDto>, response) => {
  try {
    request.body.password = hashPassword(request.body.password);
    const savedUser = await prisma.user.create({
      data: request.body,
    });

    response.status(201).send(savedUser);
  } catch (err) {
    response.sendStatus(400);
  }
});

router.get('/api/auth/status', (request, response) => {
  request.isAuthenticated()
    ? response.send({ user: request.user, session: request.session })
    : response.sendStatus(401);
});

router.get('/api/auth/github', passport.authenticate('github'));

router.get('/api/auth/github/callback', passport.authenticate('github'), (_, response) => {
  response.sendStatus(200);
});

export default router;
