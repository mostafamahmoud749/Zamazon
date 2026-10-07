import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateOrderDto } from '../dtos/createOrder.dto.js';
import { Prisma } from '../../generated/prisma/client.js';

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

router.post(
  '/api/orders',
  requireAuth,
  async (request: Request<{}, {}, CreateOrderDto>, response) => {
    const { paymentMethod, addressId } = request.body;

    const parsedAddressId = Number(addressId);

    if (!Number.isInteger(parsedAddressId) || parsedAddressId <= 0) {
      return response.sendStatus(400);
    }

    const validateAddressId = await prisma.address.findFirst({
      where: {
        id: parsedAddressId,
        userId: request.user!.id,
      },
    });

    if (!validateAddressId) {
      return response.sendStatus(400);
    }

    try {
      const cartItems = await prisma.cartItem.findMany({
        where: { userId: request.user!.id },
        select: {
          quantity: true,
          product: {
            select: {
              id: true,
              price: true,
              discount: true,
              title: true,
              description: true,
              image: true,
            },
          },
        },
      });

      if (cartItems.length === 0) {
        return response.sendStatus(400);
      }

      const totalAmount = cartItems.reduce((total, item) => {
        const discount = item.product.discount ?? new Prisma.Decimal(0);
        const discountedPrice = item.product.price.mul(
          new Prisma.Decimal(1).sub(discount.div(100)),
        );

        return total.add(discountedPrice.mul(item.quantity));
      }, new Prisma.Decimal(0));

      const order = await prisma.$transaction(async (transaction) => {
        const createdOrder = await transaction.order.create({
          data: {
            userId: request.user!.id,
            addressId: parsedAddressId,
            totalAmount,
            paymentMethod,
            orderItems: {
              create: cartItems.map((item) => {
                const discount = item.product.discount ?? new Prisma.Decimal(0);
                const discountedPrice = item.product.price.mul(
                  new Prisma.Decimal(1).sub(discount.div(100)),
                );

                return {
                  productId: item.product.id,
                  quantity: item.quantity,
                  price: discountedPrice,
                };
              }),
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
      response.sendStatus(500);
    }
  },
);

router.patch('/api/orders/:id/cancel', requireAuth, async (request, response) => {
  const orderId = Number(request.params.id);
  if (!Number.isInteger(orderId) || orderId <= 0) {
    return response.sendStatus(400);
  }

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
    response.sendStatus(500);
  }
});

export default router;
