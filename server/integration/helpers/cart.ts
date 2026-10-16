import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';
import { prisma } from '../../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './auth.js';

export async function createCartRouteFixture(app: Express) {
  const agent = request.agent(app);
  const user = {
    email: `cart-route-${crypto.randomUUID()}@example.com`,
    name: 'Cart Route User',
    password: 'Password123!',
  };

  await registerTestUser(app, user);
  await loginTestUser(agent, user);

  const userId = (await prisma.user.findUniqueOrThrow({ where: { email: user.email } })).id;

  return {
    agent,
    userId,
    createProduct: (data: { stock?: number; isActive?: boolean } = {}) =>
      prisma.product.create({
        data: {
          userId,
          stock: data.stock ?? 10,
          isActive: data.isActive ?? true,
          title: 'Cart Route Product',
          description: 'Product created for cart route integration tests',
          price: 25,
          image: 'https://example.com/cart-product.jpg',
          slug: `cart-route-product-${crypto.randomUUID()}`,
        },
      }),
    cleanup: async () => {
      await prisma.user.delete({ where: { id: userId } });
      await prisma.$disconnect();
    },
  };
}

export async function expectCartItemCount(userId: number, count: number) {
  await expect(prisma.cartItem.count({ where: { userId } })).resolves.toBe(count);
}
