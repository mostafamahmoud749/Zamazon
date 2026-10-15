import request from 'supertest';
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { createApp } from '../app.js';
import { createMockProducts } from './helpers/products.js';
import { prisma } from '@/prisma/lib/prisma.js';

const app = createApp();
let fixture: Awaited<ReturnType<typeof createMockProducts>>;

beforeAll(async () => {
  fixture = await createMockProducts();
});

afterAll(async () => {
  await prisma.orderItem.deleteMany({ where: { productId: { in: fixture.productIds } } });
  await prisma.product.deleteMany({ where: { id: { in: fixture.productIds } } });
  await prisma.category.deleteMany({
    where: { id: { in: [fixture.categoryOneId, fixture.categoryTwoId] } },
  });
  await prisma.user.deleteMany({ where: { id: { in: fixture.userIds } } });
  await prisma.$disconnect();
});

describe('GET /api/products', () => {
  it('should return a list of products', async () => {
    const response = await request(app).get('/api/products').query({ page: 1 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should return products filtered by search query', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, search: 'Product 1' });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toContain('Product 1');
  });

  it('should return products filtered by rating', async () => {
    const response = await request(app).get('/api/products').query({ page: 1, rating: 4 });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });

  it('should return products filtered by category', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ page: 1, filters: JSON.stringify([fixture.categoryOneId]) });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].categoryId).toBe(fixture.categoryOneId);
  });

  it('should return products filtered by search query, rating, and category', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({
        page: 1,
        search: 'Product',
        rating: 4,
        filters: JSON.stringify([fixture.categoryOneId]),
      });

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].title).toContain('Product');
    expect(response.body[0].categoryId).toBe(fixture.categoryOneId);
  });
});
