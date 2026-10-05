import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/api/orders/:id', requireAuth, async (request, response) => {
  const orderId = Number(request.params.id);
  if (isNaN(orderId) || orderId <= 0) {
    return response.sendStatus(400);
  }

  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId: request.user!.id },
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

    if (!order) {
      return response.sendStatus(404);
    }

    response.status(200).json(order);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

export default router;
