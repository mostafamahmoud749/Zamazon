import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/users/me', async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.sendStatus(401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return response.sendStatus(404);
    }

    response.status(200).send(user);
  } catch (err) {
    response.sendStatus(500);
  }
});

export default router;
