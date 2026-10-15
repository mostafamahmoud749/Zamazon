import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';
import { prisma } from '../../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './auth.js';

export const productPayload = {
  stock: 10,
  title: 'Route Product',
  description: 'Product created for route integration tests',
  price: 25,
  discount: 5,
  image: 'https://example.com/product.jpg',
};

export async function createProductRouteFixture(app: Express) {
  const agent = request.agent(app);
  const user = {
    email: `product-route-${crypto.randomUUID()}@example.com`,
    name: 'Product Route User',
    password: 'Password123!',
  };

  await registerTestUser(app, user);
  await loginTestUser(agent, user);

  const userId = (await prisma.user.findUniqueOrThrow({ where: { email: user.email } })).id;
  const category = await prisma.category.create({
    data: {
      name: `Product Route Category ${crypto.randomUUID()}`,
      slug: `product-route-category-${crypto.randomUUID()}`,
    },
  });
  const productSlug = `route-product-${crypto.randomUUID()}`;
  const response = await agent.post('/api/products').send({
    ...productPayload,
    categoryId: category.id,
    slug: productSlug,
  });

  expect(response.status).toBe(201);

  return {
    agent,
    categoryId: category.id,
    productId: response.body.id as number,
    productSlug,
    userId,
    cleanup: async () => {
      await prisma.user.deleteMany({ where: { email: user.email } });
      await prisma.category.delete({ where: { id: category.id } });
      await prisma.$disconnect();
    },
  };
}

export async function createOtherUserProduct(categoryId: number) {
  const otherUser = await prisma.user.create({
    data: { email: `other-product-user-${crypto.randomUUID()}@example.com` },
  });
  const product = await prisma.product.create({
    data: {
      ...productPayload,
      userId: otherUser.id,
      categoryId,
      slug: `other-product-${crypto.randomUUID()}`,
    },
  });

  return {
    id: product.id,
    cleanup: () => prisma.user.delete({ where: { id: otherUser.id } }),
  };
}
