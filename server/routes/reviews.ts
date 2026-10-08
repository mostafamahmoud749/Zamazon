import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateReviewDto, PatchReviewDto } from '../dtos/reviews.dto.js';

const router = Router();

router.get('/api/products/:id/reviews', async (request, response) => {
  try {
    const productId = Number(request.params.id);
    if (isNaN(productId) || productId <= 0) {
      return response.status(400).json({ error: 'Invalid product ID' });
    }
    const reviews = await prisma.review.findMany({
      where: {
        productId: productId,
      },
      select: {
        id: true,
        productId: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });
    response.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    response.sendStatus(500);
  }
});

router.post(
  '/api/products/:id/reviews',
  requireAuth,
  async (request: Request<{ id: string }, {}, CreateReviewDto>, response) => {
    const productId = Number(request.params.id);
    const { rating, comment } = request.body;
    const userId = request.user!.id;

    if (!Number.isInteger(productId) || productId <= 0) {
      return response.status(400).json({ error: 'Invalid product ID' });
    }

    try {
      const review = await prisma.review.create({
        data: {
          productId,
          userId,
          rating,
          comment,
        },
      });

      response.status(201).json(review);
    } catch (error) {
      console.error('Error creating review:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        return response.status(409).json({ error: 'You have already reviewed this product' });
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return response.status(404).json({ error: 'this product does not exist' });
      }

      response.sendStatus(500);
    }
  },
);

router.patch(
  '/api/products/:id/reviews/:reviewId',
  requireAuth,
  async (request: Request<{ id: string; reviewId: string }, {}, PatchReviewDto>, response) => {
    const productId = Number(request.params.id);
    const reviewId = Number(request.params.reviewId);
    const { rating, comment } = request.body;
    const userId = request.user!.id;

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
      return response.status(400).json({ error: 'Invalid product ID or review ID' });
    }

    if (Object.keys(request.body).length === 0) {
      return response.status(400).json({ error: 'No update data provided' });
    }

    try {
      const existingReview = await prisma.review.findFirst({
        where: {
          id: reviewId,
          productId: productId,
          userId: userId,
        },
      });

      if (!existingReview) {
        return response.status(404).json({ error: 'Review not found or not owned by user' });
      }

      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          rating: rating ?? existingReview.rating,
          comment: comment ?? existingReview.comment,
        },
      });

      response.status(200).json(updatedReview);
    } catch (error) {
      console.error('Error updating review:', error);
      response.sendStatus(500);
    }
  },
);

router.delete(
  '/api/products/:id/reviews/:reviewId',
  requireAuth,
  async (request: Request<{ id: string; reviewId: string }>, response) => {
    const productId = Number(request.params.id);
    const reviewId = Number(request.params.reviewId);
    const userId = request.user!.id;

    if (
      !Number.isInteger(productId) ||
      productId <= 0 ||
      !Number.isInteger(reviewId) ||
      reviewId <= 0
    ) {
      return response.status(400).json({ error: 'Invalid product ID or review ID' });
    }

    try {
      const result = await prisma.review.deleteMany({
        where: {
          id: reviewId,
          productId: productId,
          userId: userId,
        },
      });

      if (result.count === 0) {
        return response.status(404).json({ error: 'Review not found or not owned by user' });
      }

      response.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      console.error('Error deleting review:', error);
      response.sendStatus(500);
    }
  },
);

export default router;
