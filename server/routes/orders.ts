import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

router.get('/api/orders', requireAuth, async (request, response) => {
  const page = Number(request.query.page) || 1;

  try {
    const orders = await prisma.order.findMany({
      where: { userId: request.user!.id },
      take: 5,
      skip: 5 * (page - 1),
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        paymentMethod: true,
      },
    });

    response.status(200).json(orders);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

export default router;
