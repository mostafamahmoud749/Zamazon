import { csrfAgent } from './helpers/csrf.js';
import request from 'supertest';
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '@/prisma/lib/prisma.js';
import { createProductRouteFixture } from './helpers/product.js';

const app = createApp();

let fixture: Awaited<ReturnType<typeof createProductRouteFixture>>;
let creatableProductId: number;
let duplicateReviewProductId: number;
let noReviewProductId: number;
let reviewId: number;

beforeAll(async () => {
  fixture = await createProductRouteFixture(app);

  const { id } = await prisma.product.create({
    data: {
      userId: fixture.userId,
      categoryId: fixture.categoryId,
      title: 'Review Test Product',
      description: 'Product for review integration tests',
      price: 50,
      discount: 10,
      stock: 20,
      slug: `review-test-product-${crypto.randomUUID()}`,
      image: 'https://example.com/review-test-product.jpg',
      isActive: true,
    },
  });
  creatableProductId = id;

  const duplicateReviewProduct = await prisma.product.create({
    data: {
      userId: fixture.userId,
      categoryId: fixture.categoryId,
      title: 'Duplicate Review Product',
      description: 'Product for duplicate review integration tests',
      price: 40,
      discount: 0,
      stock: 10,
      slug: `duplicate-review-product-${crypto.randomUUID()}`,
      image: 'https://example.com/duplicate-review-product.jpg',
      isActive: true,
    },
  });
  duplicateReviewProductId = duplicateReviewProduct.id;

  const noReviewProduct = await prisma.product.create({
    data: {
      userId: fixture.userId,
      categoryId: fixture.categoryId,
      title: 'No Review Product',
      description: 'Product with no reviews for integration tests',
      price: 30,
      discount: 0,
      stock: 10,
      slug: `no-review-product-${crypto.randomUUID()}`,
      image: 'https://example.com/no-review-product.jpg',
      isActive: true,
    },
  });
  noReviewProductId = noReviewProduct.id;

  const { id: createdReviewId } = await prisma.review.create({
    data: {
      productId: fixture.productId,
      userId: fixture.userId,
      rating: 5,
      comment: 'Great product!',
    },
  });
  reviewId = createdReviewId;
});

afterAll(async () => {
  await fixture.cleanup();
});

describe('GET /api/products/:id/reviews', () => {
  it('returns reviews for a product', async () => {
    const response = await request(app).get(`/api/products/${fixture.productId}/reviews`);

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          productId: fixture.productId,
          rating: 5,
          comment: 'Great product!',
          user: expect.objectContaining({
            id: fixture.userId,
            name: 'Product Route User',
          }),
        }),
      ]),
    );
  });

  it('returns 404 for a product with no reviews', async () => {
    const response = await request(app).get(`/api/products/${noReviewProductId}/reviews`);

    expect(response.status).toBe(404);
  });

  it('returns 400 for an invalid product id', async () => {
    const response = await request(app).get(`/api/products/not-a-number/reviews`);

    expect(response.status).toBe(400);
  });

  it('returns 404 for a non-existent product', async () => {
    const response = await request(app).get(`/api/products/999999/reviews`);

    expect(response.status).toBe(404);
  });
});

describe('POST /api/products/:id/reviews', () => {
  it('requires authentication', async () => {
    const response = await (await csrfAgent(app))
      .post(`/api/products/${fixture.productId}/reviews`)
      .send({ rating: 5, comment: 'Excellent product!' });

    expect(response.status).toBe(401);
  });

  it('creates a review for the authenticated user', async () => {
    const response = await fixture.agent
      .post(`/api/products/${creatableProductId}/reviews`)
      .send({ rating: 4, comment: 'Good product!' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        productId: creatableProductId,
        userId: fixture.userId,
        rating: 4,
        comment: 'Good product!',
      }),
    );
  });

  it('returns 400 for invalid review data', async () => {
    const response = await fixture.agent
      .post(`/api/products/${fixture.productId}/reviews`)
      .send({ rating: 6, comment: '' });

    expect(response.status).toBe(400);
  });

  it('returns 404 for a non-existent product', async () => {
    const response = await fixture.agent
      .post(`/api/products/999999/reviews`)
      .send({ rating: 5, comment: 'Excellent product!' });

    expect(response.status).toBe(404);
  });

  it('returns 409 for a duplicate review by the same user', async () => {
    const firstResponse = await fixture.agent
      .post(`/api/products/${duplicateReviewProductId}/reviews`)
      .send({ rating: 5, comment: 'First review!' });

    expect(firstResponse.status).toBe(201);

    const response = await fixture.agent
      .post(`/api/products/${duplicateReviewProductId}/reviews`)
      .send({ rating: 4, comment: 'Duplicate review!' });

    expect(response.status).toBe(409);
  });
});

describe('PATCH /api/products/:id/reviews/:reviewId', () => {
  it('requires authentication', async () => {
    const response = await (await csrfAgent(app))
      .patch(`/api/products/${fixture.productId}/reviews/${reviewId}`)
      .send({ rating: 3, comment: 'Updated review!' });

    expect(response.status).toBe(401);
  });

  it('updates a review for the authenticated user', async () => {
    const response = await fixture.agent
      .patch(`/api/products/${fixture.productId}/reviews/${reviewId}`)
      .send({ rating: 4, comment: 'Updated review!' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        productId: fixture.productId,
        userId: fixture.userId,
        rating: 4,
        comment: 'Updated review!',
      }),
    );
  });

  it('returns 400 for invalid review data', async () => {
    const response = await fixture.agent
      .patch(`/api/products/${fixture.productId}/reviews/${reviewId}`)
      .send({ rating: 6, comment: '' });

    expect(response.status).toBe(400);
  });

  it('returns 404 for a non-existent review', async () => {
    const response = await fixture.agent
      .patch(`/api/products/${fixture.productId}/reviews/999999`)
      .send({ rating: 4, comment: 'Updated review!' });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/products/:id/reviews/:reviewId', () => {
  it('requires authentication', async () => {
    const response = await (await csrfAgent(app)).delete(
      `/api/products/${fixture.productId}/reviews/${reviewId}`,
    );

    expect(response.status).toBe(401);
  });

  it('deletes a review for the authenticated user', async () => {
    const response = await fixture.agent.delete(
      `/api/products/${fixture.productId}/reviews/${reviewId}`,
    );

    expect(response.status).toBe(204);
  });

  it('returns 404 for a non-existent review', async () => {
    const response = await fixture.agent.delete(
      `/api/products/${fixture.productId}/reviews/999999`,
    );

    expect(response.status).toBe(404);
  });
});
