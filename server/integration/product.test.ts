import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import {
  createOtherUserProduct,
  createProductRouteFixture,
  productPayload,
} from './helpers/product.js';

const app = createApp();
let fixture: Awaited<ReturnType<typeof createProductRouteFixture>>;

beforeAll(async () => {
  fixture = await createProductRouteFixture(app);
});

afterAll(async () => {
  if (fixture) {
    await fixture.cleanup();
  }
});

describe('GET /api/products/:id', () => {
  it('returns an active product', async () => {
    const response = await request(app).get(`/api/products/${fixture.productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: fixture.productId,
        title: productPayload.title,
        userId: fixture.userId,
      }),
    );
  });

  it('returns 404 for a missing product', async () => {
    const response = await request(app).get('/api/products/999999');

    expect(response.status).toBe(404);
  });

  it('returns 400 for an invalid product id', async () => {
    const response = await request(app).get('/api/products/not-a-number');

    expect(response.status).toBe(400);
  });
});

describe('POST /api/products', () => {
  it('requires authentication', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({ ...productPayload, slug: `unauthenticated-${crypto.randomUUID()}` });

    expect(response.status).toBe(401);
  });

  it('creates a product for the authenticated user', async () => {
    const slug = `created-${crypto.randomUUID()}`;
    const response = await fixture.agent.post('/api/products').send({
      ...productPayload,
      title: 'Created Product',
      categoryId: fixture.categoryId,
      slug,
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        title: 'Created Product',
        slug,
        categoryId: fixture.categoryId,
        userId: fixture.userId,
      }),
    );
  });

  it('returns 400 for invalid product data', async () => {
    const response = await fixture.agent.post('/api/products').send({
      ...productPayload,
      categoryId: fixture.categoryId,
      slug: `invalid-${crypto.randomUUID()}`,
      price: -1,
    });

    expect(response.status).toBe(400);
  });

  it('returns 409 for a duplicate slug', async () => {
    const response = await fixture.agent.post('/api/products').send({
      ...productPayload,
      categoryId: fixture.categoryId,
      slug: fixture.productSlug,
    });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'A product with this slug already exists' });
  });

  it('returns 404 for a missing category', async () => {
    const response = await fixture.agent.post('/api/products').send({
      ...productPayload,
      categoryId: 999999,
      slug: `missing-category-${crypto.randomUUID()}`,
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Category does not exist' });
  });
});

describe('PATCH /api/products/:id', () => {
  it('requires authentication', async () => {
    const response = await request(app)
      .patch(`/api/products/${fixture.productId}`)
      .send({ title: 'Unauthenticated update' });

    expect(response.status).toBe(401);
  });

  it('updates a product owned by the authenticated user', async () => {
    const response = await fixture.agent.patch(`/api/products/${fixture.productId}`).send({
      title: 'Updated Product',
      stock: 20,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ id: fixture.productId, title: 'Updated Product', stock: 20 }),
    );
  });

  it('returns 400 for an empty update', async () => {
    const response = await fixture.agent.patch(`/api/products/${fixture.productId}`).send({});

    expect(response.status).toBe(400);
  });

  it('returns 404 for a missing product', async () => {
    const response = await fixture.agent.patch('/api/products/999999').send({ title: 'Missing' });

    expect(response.status).toBe(404);
  });

  it('returns 404 when updating another user product', async () => {
    const otherProduct = await createOtherUserProduct(fixture.categoryId);
    const response = await fixture.agent
      .patch(`/api/products/${otherProduct.id}`)
      .send({ title: 'Denied' });

    expect(response.status).toBe(404);
    await otherProduct.cleanup();
  });
});

describe('DELETE /api/products/:id', () => {
  it('requires authentication', async () => {
    const response = await request(app).delete(`/api/products/${fixture.productId}`);

    expect(response.status).toBe(401);
  });

  it('soft-deletes a product owned by the authenticated user', async () => {
    const response = await fixture.agent.delete(`/api/products/${fixture.productId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ id: fixture.productId, isActive: false }),
    );

    const getResponse = await request(app).get(`/api/products/${fixture.productId}`);
    expect(getResponse.status).toBe(404);
  });

  it('returns 404 for a missing product', async () => {
    const response = await fixture.agent.delete('/api/products/999999');

    expect(response.status).toBe(404);
  });
});
