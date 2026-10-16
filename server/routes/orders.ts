import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateOrderDto } from '../dtos/Order.dto.js';
import { Prisma } from '../../generated/prisma/client.js';
import { validateQuery } from '../middleware/validateQuery.js';
import {
  CreateOrderSchema,
  OrderIdParamsSchema,
  OrderQuerySchema,
} from '../schemas/Orders.schema.js';
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
    const { paymentMethod, addressId } = request.body;

    try {
      const validateAddress = await prisma.address.findFirst({
        where: {
          id: addressId,
          userId: request.user!.id,
        },
      });

      if (!validateAddress) {
        return response.sendStatus(400);
      }

      const order = await prisma.$transaction(async (transaction) => {
        const cartItems = await transaction.cartItem.findMany({
          where: { userId: request.user!.id },
          select: {
            quantity: true,
            product: {
              select: {
                id: true,
                price: true,
                discount: true,
                stock: true,
                isActive: true,
              },
            },
          },
        });

        if (cartItems.length === 0) {
          throw new Error('EMPTY_CART');
        }

        const orderItems = [];
        let totalAmount = new Prisma.Decimal(0);

        for (const item of cartItems) {
          if (!item.product.isActive || item.product.stock < item.quantity) {
            throw new Error('INSUFFICIENT_STOCK');
          }

          const discount = item.product.discount ?? new Prisma.Decimal(0);
          const discountedPrice = item.product.price.mul(
            new Prisma.Decimal(1).sub(discount.div(100)),
          );

          await transaction.product
            .updateMany({
              where: {
                id: item.product.id,
                isActive: true,
                stock: { gte: item.quantity },
              },
              data: { stock: { decrement: item.quantity } },
            })
            .then((result) => {
              if (result.count !== 1) {
                throw new Error('INSUFFICIENT_STOCK');
              }
            });

          totalAmount = totalAmount.add(discountedPrice.mul(item.quantity));
          orderItems.push({
            productId: item.product.id,
            quantity: item.quantity,
            price: discountedPrice,
          });
        }

        const createdOrder = await transaction.order.create({
          data: {
            userId: request.user!.id,
            addressId,
            totalAmount,
            paymentMethod,
            orderItems: {
              create: orderItems,
            },
          },
          include: {
            orderItems: true,
          },
        });

        await transaction.cartItem.deleteMany({
          where: { userId: request.user!.id },
        });

        return createdOrder;
      });

      response.status(201).json(order);
    } catch (error) {
      console.error(error);
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
      const order = await prisma.order.findFirst({
        where: { id: orderId, userId: request.user!.id },
      });

      if (!order) {
        return response.sendStatus(404);
      }

      if (order.status !== 'PENDING') {
        return response.sendStatus(400);
      }

      const updatedOrder = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELED' },
      });

      response.status(200).json(updatedOrder);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export default router;
