import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/cart', async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.sendStatus(401);
  }

  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: request.user.id },
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
