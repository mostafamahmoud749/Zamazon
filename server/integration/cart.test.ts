import { csrfAgent } from './helpers/csrf.js';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { MAX_CART_QUANTITY } from '../schemas/Cart.schema.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { createCartRouteFixture, expectCartItemCount } from './helpers/cart.js';

const app = createApp();
let fixture: Awaited<ReturnType<typeof createCartRouteFixture>>;

beforeAll(async () => {
  fixture = await createCartRouteFixture(app);
});

beforeEach(async () => {
  await prisma.cartItem.deleteMany({ where: { userId: fixture.userId } });
});

afterAll(async () => {
  if (fixture) {
    await fixture.cleanup();
  }
});

describe('GET /api/cart/items', () => {
  it('requires authentication', async () => {
    const response = await request(app).get('/api/cart/items');

    expect(response.status).toBe(401);
  });

  it('returns the authenticated user cart with product details', async () => {
    const product = await fixture.createProduct();
    await prisma.cartItem.create({
      data: { userId: fixture.userId, productId: product.id, quantity: 2 },
    });

    const response = await fixture.agent.get('/api/cart/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      expect.objectContaining({
        quantity: 2,
        product: expect.objectContaining({ id: product.id, title: 'Cart Route Product' }),
      }),
    ]);
  });
});

describe('POST /api/cart/items', () => {
  it('requires authentication', async () => {
    const response = await (await csrfAgent(app)).post('/api/cart/items').send({ productId: 1, quantity: 1 });

    expect(response.status).toBe(401);
  });

  it('creates and then merges a cart item', async () => {
    const product = await fixture.createProduct({ stock: 10 });

    const createResponse = await fixture.agent
      .post('/api/cart/items')
      .send({ productId: product.id, quantity: 3 });
    const mergeResponse = await fixture.agent
      .post('/api/cart/items')
      .send({ productId: product.id, quantity: 4 });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toEqual(
      expect.objectContaining({ productId: product.id, quantity: 3 }),
    );
    expect(mergeResponse.status).toBe(200);
    expect(mergeResponse.body).toEqual(
      expect.objectContaining({ productId: product.id, quantity: 7 }),
    );
    await expectCartItemCount(fixture.userId, 1);
  });

  it('rejects unavailable products, insufficient stock, and excessive quantities', async () => {
    const inactiveProduct = await fixture.createProduct({ isActive: false });
    const inactiveResponse = await fixture.agent
      .post('/api/cart/items')
      .send({ productId: inactiveProduct.id, quantity: 1 });

    const lowStockProduct = await fixture.createProduct({ stock: 2 });
    const stockResponse = await fixture.agent
      .post('/api/cart/items')
      .send({ productId: lowStockProduct.id, quantity: 3 });

    const largeStockProduct = await fixture.createProduct({ stock: MAX_CART_QUANTITY });
    const quantityResponse = await fixture.agent
      .post('/api/cart/items')
      .send({ productId: largeStockProduct.id, quantity: MAX_CART_QUANTITY });
    const limitResponse = await fixture.agent
      .post('/api/cart/items')
      .send({ productId: largeStockProduct.id, quantity: 1 });

    expect(inactiveResponse.status).toBe(404);
    expect(inactiveResponse.body).toEqual({ error: 'Product is unavailable' });
    expect(stockResponse.status).toBe(409);
    expect(stockResponse.body).toEqual({ error: 'Not enough stock available' });
    expect(quantityResponse.status).toBe(201);
    expect(limitResponse.status).toBe(400);
    expect(limitResponse.body).toEqual({
      error: `Cart quantity cannot exceed ${MAX_CART_QUANTITY}`,
    });
  });
});

describe('PATCH /api/cart/items/:id', () => {
  it('updates a cart item and rejects unavailable quantities', async () => {
    const product = await fixture.createProduct({ stock: 3 });
    const item = await prisma.cartItem.create({
      data: { userId: fixture.userId, productId: product.id, quantity: 1 },
    });

    const updateResponse = await fixture.agent
      .patch(`/api/cart/items/${item.id}`)
      .send({ quantity: 3 });
    const stockResponse = await fixture.agent
      .patch(`/api/cart/items/${item.id}`)
      .send({ quantity: 4 });
    const missingResponse = await fixture.agent
      .patch('/api/cart/items/999999')
      .send({ quantity: 1 });

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body).toEqual(expect.objectContaining({ id: item.id, quantity: 3 }));
    expect(stockResponse.status).toBe(400);
    expect(stockResponse.body).toEqual({ error: 'Not enough stock available' });
    expect(missingResponse.status).toBe(404);
  });
});

describe('DELETE /api/cart/items/:id', () => {
  it('requires authentication and deletes the user cart item', async () => {
    const product = await fixture.createProduct();
    const item = await prisma.cartItem.create({
      data: { userId: fixture.userId, productId: product.id, quantity: 1 },
    });

    const unauthenticatedResponse = await (await csrfAgent(app)).delete(`/api/cart/items/${item.id}`);
    const deleteResponse = await fixture.agent.delete(`/api/cart/items/${item.id}`);

    expect(unauthenticatedResponse.status).toBe(401);
    expect(deleteResponse.status).toBe(200);
    await expectCartItemCount(fixture.userId, 0);
  });
});
