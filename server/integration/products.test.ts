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

  it('should filter by average rating, including averages equal to the threshold', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({
        page: 1,
        rating: 4,
        filters: JSON.stringify([fixture.categoryOneId, fixture.categoryTwoId]),
      });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual([fixture.productIds[0]]);
  });

  it('should return no products when no average meets the rating threshold', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({
        rating: 4.5,
        filters: JSON.stringify([fixture.categoryOneId, fixture.categoryTwoId]),
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should include unrated products when the rating filter is disabled', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({
        rating: 0,
        filters: JSON.stringify([fixture.categoryOneId, fixture.categoryTwoId]),
      });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual(
      expect.arrayContaining(fixture.productIds),
    );
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

describe('GET /api/products cumulative pagination', () => {
  const search = `pagination-${crypto.randomUUID()}`;
  let productIds: number[];

  beforeAll(async () => {
    const products = await prisma.product.createManyAndReturn({
      data: Array.from({ length: 46 }, (_, index) => ({
        userId: fixture.userIds[0],
        categoryId: fixture.categoryOneId,
        title: `${search} ${index}`,
        description: 'Pagination test fixture',
        price: 10,
        stock: 1,
        slug: `${search}-${index}`,
        image: 'https://example.com/product.jpg',
        isActive: index < 45,
      })),
    });
    fixture.productIds.push(...products.map(({ id }) => id));
    productIds = products
      .filter(({ isActive }) => isActive)
      .map(({ id }) => id)
      .sort((a, b) => a - b);
  });

  it('returns pages 1 and 2 together when cumulative=true', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ search, page: 2, cumulative: 'true' });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual(productIds.slice(0, 40));
  });

  it('returns all available matches when the cumulative range exceeds the result count', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({ search, page: 3, cumulative: 'true' });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual(productIds);
  });

  it('defaults to page 1 with cumulative=true', async () => {
    const response = await request(app).get('/api/products').query({ search, cumulative: 'true' });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual(productIds.slice(0, 20));
  });

  it.each(['true', 'false'])('accepts page 50 with cumulative=%s', async (cumulative) => {
    const response = await request(app)
      .get('/api/products')
      .query({ search, page: 50, cumulative });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual(
      cumulative === 'true' ? productIds : [],
    );
  });

  it.each(['true', 'false'])('rejects page 51 with cumulative=%s', async (cumulative) => {
    const response = await request(app)
      .get('/api/products')
      .query({ search, page: 51, cumulative });

    expect(response.status).toBe(400);
    expect(response.body.details.fieldErrors.page).toBeDefined();
  });

  it.each([undefined, 'false'])('returns only page 2 with cumulative=%s', async (cumulative) => {
    const response = await request(app)
      .get('/api/products')
      .query({ search, page: 2, ...(cumulative === undefined ? {} : { cumulative }) });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual(productIds.slice(20, 40));
  });

  it('preserves search, category, and rating filters in cumulative mode', async () => {
    const response = await request(app)
      .get('/api/products')
      .query({
        page: 2,
        cumulative: 'true',
        search: 'Product',
        filters: JSON.stringify([fixture.categoryOneId]),
        rating: 4,
      });

    expect(response.status).toBe(200);
    expect(response.body.map(({ id }: { id: number }) => id)).toEqual([fixture.productIds[0]]);
  });

  it.each(['yes', '1', '', ['true', 'false']])(
    'rejects invalid cumulative value %j',
    async (cumulative) => {
      const response = await request(app).get('/api/products').query({ cumulative });

      expect(response.status).toBe(400);
    },
  );
});
