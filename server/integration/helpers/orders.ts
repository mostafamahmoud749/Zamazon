import type { Express } from 'express';
import request from 'supertest';
import { expect, vi } from 'vitest';
import { prisma } from '../../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './auth.js';

export async function createOrderRouteFixture(app: Express) {
  const agent = request.agent(app);
  const user = {
    email: `order-route-${crypto.randomUUID()}@example.com`,
    name: 'Order Route User',
    password: 'Password123!',
  };

  await registerTestUser(app, user);
  await loginTestUser(agent, user);

  const userId = (await prisma.user.findUniqueOrThrow({ where: { email: user.email } })).id;

  return {
    agent,
    userId,
    createAddress: () =>
      prisma.address.create({
        data: {
          userId,
          street: '123 Order Street',
          city: 'Ordertown',
          state: 'CA',
          postalCode: '12345',
          country: 'USA',
        },
      }),
    createProduct: (
      data: { stock?: number; price?: number; discount?: number; isActive?: boolean } = {},
    ) =>
      prisma.product.create({
        data: {
          userId,
          stock: data.stock ?? 10,
          price: data.price ?? 25,
          discount: data.discount ?? 0,
          isActive: data.isActive ?? true,
          title: 'Order Route Product',
          description: 'Product created for order route integration tests',
          image: 'https://example.com/order-product.jpg',
          slug: `order-route-product-${crypto.randomUUID()}`,
        },
      }),
    addToCart: (productId: number, quantity: number) =>
      prisma.cartItem.create({ data: { userId, productId, quantity } }),
    cleanup: async () => {
      await prisma.orderItem.deleteMany({ where: { order: { userId } } });
      await prisma.payment.deleteMany({ where: { order: { userId } } });
      await prisma.order.deleteMany({ where: { userId } });
      await prisma.cartItem.deleteMany({ where: { userId } });
      await prisma.address.deleteMany({ where: { userId } });
      await prisma.product.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
      await prisma.$disconnect();
    },
  };
}

export async function createForeignUserAddress() {
  const user = await prisma.user.create({
    data: { email: `foreign-order-user-${crypto.randomUUID()}@example.com` },
  });
  const address = await prisma.address.create({
    data: {
      userId: user.id,
      street: '999 Foreign Street',
      city: 'Elsewhere',
      state: 'NY',
      postalCode: '99999',
      country: 'USA',
    },
  });

  return { address, cleanup: () => prisma.user.delete({ where: { id: user.id } }) };
}

export async function expectOrderCount(userId: number, count: number) {
  await expect(prisma.order.count({ where: { userId } })).resolves.toBe(count);
}

export function synchronizeCartReads() {
  // Hold each cart read until both real database transactions have read it.
  // This forces the race instead of relying on request timing.
  let readCount = 0;
  let releaseReads!: () => void;
  const bothHaveRead = new Promise<void>((resolve) => {
    releaseReads = resolve;
  });
  const runTransaction = prisma.$transaction.bind(prisma);
  const transactionSpy = vi
    .spyOn(prisma, '$transaction')
    .mockImplementation(async (operation, options) => {
      if (typeof operation !== 'function') throw new Error('Expected interactive transaction');
      return runTransaction(async (transaction) => {
        const cartItem = new Proxy(transaction.cartItem, {
          get(delegate, property, receiver) {
            if (property === 'findMany') {
              return async (...args: Parameters<typeof delegate.findMany>) => {
                const items = await delegate.findMany(...args);
                if (++readCount === 2) releaseReads();
                await bothHaveRead;
                return items;
              };
            }
            return Reflect.get(delegate, property, receiver);
          },
        });
        return operation(
          new Proxy(transaction, {
            get(target, property, receiver) {
              return property === 'cartItem' ? cartItem : Reflect.get(target, property, receiver);
            },
          }),
        );
      }, options);
    });
  return () => {
    releaseReads();
    transactionSpy.mockRestore();
  };
}
