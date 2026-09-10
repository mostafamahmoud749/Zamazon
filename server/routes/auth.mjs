import { Router } from 'express';
import passport from 'passport';
import { User } from '../mongoose/schemas/users.mjs';
import { hashPassword } from '../utils/helpers.mjs';

const router = Router();

router.post('/api/auth/login', passport.authenticate('local'), (request, response) => {
  response.sendStatus(200);
});

router.post('/api/auth/register', async (request, response) => {
  try {
    request.body.password = hashPassword(request.body.password)
    const savedUser = await User.create(request.body);

    response.status(201).send(savedUser);
  } catch (err) {
    response.sendStatus(400);
  }
});

router.get('/api/auth/status', (requset, response) => {
  requset.isAuthenticated() ? response.send(requset.user) : response.sendStatus(401);
});

export default router;
