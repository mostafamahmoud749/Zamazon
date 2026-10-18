import { prisma } from '../../prisma/lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import type { CreateOrderDto } from '../dtos/Order.dto.js';
import { isPrismaError } from '../utils/isPrismaError.js';

type CheckoutOrder = Prisma.OrderGetPayload<{ include: { orderItems: true } }>;

export async function checkout(userId: number, input: CreateOrderDto, idempotencyKey: string) {
  const { addressId, paymentMethod } = input;
  const where = { userId_idempotencyKey: { userId, idempotencyKey } };

  const replay = (order: CheckoutOrder) => {
    if (order.addressId !== addressId || order.paymentMethod !== paymentMethod) {
      throw new Error('IDEMPOTENCY_KEY_REUSED');
    }
    return { order, created: false };
  };

  for (let attempt = 0; ; attempt++) {
    try {
      return await prisma.$transaction(
        async (transaction) => {
          // Replay before checking the address or current cart: checkout already succeeded.
          const existingOrder = await transaction.order.findUnique({
            where,
            include: { orderItems: true },
          });
          if (existingOrder) return replay(existingOrder);

          const address = await transaction.address.findFirst({
            where: { id: addressId, userId },
            select: { id: true },
          });
          if (!address) throw new Error('INVALID_ADDRESS');

          const cartItems = await transaction.cartItem.findMany({
            where: { userId },
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
            const discountedPrice = item.product.price
              .mul(new Prisma.Decimal(1).sub(discount.div(100)))
              .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);

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
              userId,
              addressId,
              totalAmount,
              paymentMethod,
              idempotencyKey,
              orderItems: {
                create: orderItems,
              },
            },
            include: {
              orderItems: true,
            },
          });

          await transaction.cartItem.deleteMany({
            where: { userId },
          });

          return { order: createdOrder, created: true };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );
    } catch (error) {
      if (isPrismaError(error, 'P2002')) {
        const existingOrder = await prisma.order.findUnique({
          where,
          include: { orderItems: true },
        });
        if (existingOrder) return replay(existingOrder);
      }

      if (isPrismaError(error, 'P2034') && attempt < 2) continue;
      throw error;
    }
  }
}
