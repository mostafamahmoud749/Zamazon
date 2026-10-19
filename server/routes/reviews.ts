import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateReviewDto, PatchReviewDto } from '../dtos/Reviews.dto.js';
import { validateParams } from '../middleware/validateParams.js';
import { ProducIdParamsSchema } from '../../schemas/Product.schema.js';
import {
  CreateReviewSchema,
  ReviewRouteParamsSchema,
  UpdateReviewSchema,
} from '../../schemas/reviews.schema.js';
import { validateBody } from '../middleware/validateBody.js';
import { isPrismaError } from '../utils/isPrismaError.js';

const router = Router();

router.get(
  '/api/products/:id/reviews',
  validateParams(ProducIdParamsSchema),
  async (request, response) => {
    const productId = response.locals.params.id;
    try {
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
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (reviews.length === 0) {
        response.sendStatus(404);
        return;
      }

      response.json(reviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },
);

router.post(
  '/api/products/:id/reviews',
  requireAuth,
  validateParams(ProducIdParamsSchema),
  validateBody(CreateReviewSchema),
  async (request: Request<{ id: string }, {}, CreateReviewDto>, response) => {
    const productId = response.locals.params.id;
    const { rating, comment } = request.body;
    const userId = request.user!.id;

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
      if (isPrismaError(error, 'P2002')) {
        return response.status(409).json({ error: 'You have already reviewed this product' });
      }

      if (isPrismaError(error, 'P2003')) {
        return response.status(404).json({ error: 'This product does not exist' });
      }

      throw error;
    }
  },
);

router.patch(
  '/api/products/:id/reviews/:reviewId',
  validateParams(ReviewRouteParamsSchema),
  validateBody(UpdateReviewSchema),
  requireAuth,
  async (request: Request<{ id: string; reviewId: string }, {}, PatchReviewDto>, response) => {
    const { id: productId, reviewId } = response.locals.params;
    const { rating, comment } = request.body;
    const userId = request.user!.id;

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
      throw error;
    }
  },
);

router.delete(
  '/api/products/:id/reviews/:reviewId',
  requireAuth,
  validateParams(ReviewRouteParamsSchema),
  async (request: Request<{ id: string; reviewId: string }>, response) => {
    const { id: productId, reviewId } = response.locals.params;
    const userId = request.user!.id;

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

      response.sendStatus(204);
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },
);

export default router;
