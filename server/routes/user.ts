import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/api/users/me', requireAuth, async (request, response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.id },
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

    response.status(200).json(user);
  } catch (err) {
    response.sendStatus(500);
  }
});

export default router;
