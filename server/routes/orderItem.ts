import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/order/:id', async (request, response) => {
  if (!request.isAuthenticated()) {
    return response.sendStatus(401);
  }

  const orderId = Number(request.params.id);
  if (isNaN(orderId) || orderId <= 0) {
    return response.sendStatus(400);
  }

  try {
    const order = await prisma.orderItem.findUnique({
      where: { id: orderId },
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
