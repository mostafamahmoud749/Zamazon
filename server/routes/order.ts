import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/orders', async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.sendStatus(401);
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: request.user.id },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        paymentMethod: true,
        orderItems: {
          select: {
            id: true,
            quantity: true,
            price: true,
            product: {
              select: {
                id: true,
                title: true,
                description: true,
                image: true,
              },
            },
          },
        },
      },
    });

    response.status(200).json(orders);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

export default router;
