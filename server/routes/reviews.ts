import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/products/:productId/reviews', async (request, response) => {
  try {
    const productId = Number(request.params.productId);
    if (isNaN(productId) || productId <= 0) {
      return response.status(400).json({ error: 'Invalid product ID' });
    }
    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
    });
    response.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    response.sendStatus(500);
  }
});

export default router;
