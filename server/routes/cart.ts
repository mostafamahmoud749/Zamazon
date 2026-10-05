import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/api/cart', requireAuth, async (request, response) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: request.user!.id },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            image: true,
            discount: true,
            stock: true,
          },
        },
      },
    });

    response.status(200).json(cart);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

export default router;
