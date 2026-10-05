import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('api/addresses', async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.sendStatus(401);
  }

  try {
    const addresses = await prisma.address.findMany({
      where: { userId: request.user.id },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });

    response.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

export default router;