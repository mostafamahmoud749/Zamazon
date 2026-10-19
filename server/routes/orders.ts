import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateOrderDto } from '../dtos/Order.dto.js';
import { checkout } from '../services/checkout.js';
import { validateQuery } from '../middleware/validateQuery.js';
import {
  CreateOrderSchema,
  IdempotencyKeySchema,
  OrderIdParamsSchema,
  OrderQuerySchema,
} from '../../schemas/Orders.schema.js';
import { validateParams } from '../middleware/validateParams.js';
import { validateBody } from '../middleware/validateBody.js';
import { isPrismaError } from '../utils/isPrismaError.js';

const router = Router();

router.get(
  '/api/orders',
  requireAuth,
  validateQuery(OrderQuerySchema),
  async (request, response) => {
    const page = response.locals.query.page;

    try {
      const orders = await prisma.order.findMany({
        where: { userId: request.user!.id },
        take: 5,
        skip: 5 * (page - 1),
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
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
      throw error;
    }
  },
);

router.get(
  '/api/orders/:id',
  requireAuth,
  validateParams(OrderIdParamsSchema),
  async (request, response) => {
    const orderId = response.locals.params.id;

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
      throw error;
    }
  },
);

router.post(
  '/api/orders',
  requireAuth,
  validateBody(CreateOrderSchema),
  async (request: Request<{}, {}, CreateOrderDto>, response) => {
    const key = IdempotencyKeySchema.safeParse(request.get('Idempotency-Key'));
    if (!key.success) {
      return response.status(400).json({
        error: 'Idempotency-Key must contain 1-128 letters, digits, hyphens, or underscores',
      });
    }

    try {
      const result = await checkout(request.user!.id, request.body, key.data);
      response.status(result.created ? 201 : 200).json(result.order);
    } catch (error) {
      console.error(error);
      if (error instanceof Error && error.message === 'IDEMPOTENCY_KEY_REUSED') {
        return response.status(409).json({
          error: 'Idempotency key was already used with different checkout details',
        });
      }

      if (error instanceof Error && error.message === 'INVALID_ADDRESS') {
        return response.sendStatus(400);
      }

      if (error instanceof Error && error.message === 'EMPTY_CART') {
        return response.status(400).json({ error: 'Cart is empty' });
      }

      if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
        return response.status(409).json({ error: 'Some products are out of stock' });
      }

      if (isPrismaError(error, 'P2003')) {
        return response.status(400).json({ error: 'Address does not exist' });
      }

      if (isPrismaError(error, 'P2034')) {
        return response
          .status(409)
          .json({ error: 'Order could not be completed; please try again' });
      }

      throw error;
    }
  },
);

router.patch(
  '/api/orders/:id/cancel',
  requireAuth,
  validateParams(OrderIdParamsSchema),
  async (request, response) => {
    const orderId = response.locals.params.id;

    try {
      const updatedOrder = await prisma.$transaction(async (transaction) => {
        const order = await transaction.order.findFirst({
          where: { id: orderId, userId: request.user!.id },
        });

        if (!order) {
          throw new Error('ORDER_NOT_FOUND');
        }

        const canceled = await transaction.order.updateMany({
          where: { id: orderId, userId: request.user!.id, status: 'PENDING' },
          data: { status: 'CANCELED' },
        });

        if (canceled.count !== 1) {
          throw new Error('ORDER_NOT_PENDING');
        }

        const orderItems = await transaction.orderItem.findMany({
          where: { orderId },
          select: { productId: true, quantity: true },
          orderBy: { productId: 'asc' },
        });

        for (const item of orderItems) {
          await transaction.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          });
        }

        return { ...order, status: 'CANCELED' };
      });

      response.status(200).json(updatedOrder);
    } catch (error) {
      if (error instanceof Error && error.message === 'ORDER_NOT_FOUND') {
        return response.sendStatus(404);
      }

      if (error instanceof Error && error.message === 'ORDER_NOT_PENDING') {
        return response.sendStatus(400);
      }

      console.error(error);
      throw error;
    }
  },
);

export default router;
