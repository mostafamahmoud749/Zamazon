import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import {
  createForeignUserAddress,
  createOrderRouteFixture,
  expectOrderCount,
} from './helpers/orders.js';

const app = createApp();
let fixture: Awaited<ReturnType<typeof createOrderRouteFixture>>;

beforeAll(async () => {
  fixture = await createOrderRouteFixture(app);
});

beforeEach(async () => {
  await prisma.orderItem.deleteMany({ where: { order: { userId: fixture.userId } } });
  await prisma.order.deleteMany({ where: { userId: fixture.userId } });
  await prisma.cartItem.deleteMany({ where: { userId: fixture.userId } });
  await prisma.address.deleteMany({ where: { userId: fixture.userId } });
  await prisma.product.deleteMany({ where: { userId: fixture.userId } });
});

afterAll(async () => {
  if (fixture) {
    await fixture.cleanup();
  }
});

describe('GET /api/orders', () => {
  it('requires authentication and returns the user order page', async () => {
    const unauthenticatedResponse = await request(app).get('/api/orders');
    const address = await fixture.createAddress();
    await prisma.order.createMany({
      data: Array.from({ length: 6 }, (_, index) => ({
        userId: fixture.userId,
        addressId: address.id,
        totalAmount: index + 1,
        paymentMethod: 'credit_card',
        createdAt: new Date(Date.now() + index),
      })),
    });

    const response = await fixture.agent.get('/api/orders?page=2');

    expect(unauthenticatedResponse.status).toBe(401);
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toEqual(
      expect.objectContaining({
        totalAmount: '1',
        status: 'PENDING',
        paymentMethod: 'credit_card',
      }),
    );
  });

  it('rejects an invalid page', async () => {
    const response = await fixture.agent.get('/api/orders?page=0');

    expect(response.status).toBe(400);
  });
});

describe('POST /api/orders', () => {
  it('creates an order, applies discounts, decrements stock, and clears the cart', async () => {
    const address = await fixture.createAddress();
    const product = await fixture.createProduct({ price: 20, discount: 10, stock: 5 });
    await fixture.addToCart(product.id, 2);

    const response = await fixture.agent
      .post('/api/orders')
      .send({ addressId: address.id, paymentMethod: 'credit_card' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        userId: fixture.userId,
        addressId: address.id,
        totalAmount: '36',
        paymentMethod: 'credit_card',
        orderItems: [expect.objectContaining({ productId: product.id, quantity: 2, price: '18' })],
      }),
    );
    await expectOrderCount(fixture.userId, 1);
    await expect(prisma.cartItem.count({ where: { userId: fixture.userId } })).resolves.toBe(0);
    await expect(prisma.product.findUniqueOrThrow({ where: { id: product.id } })).resolves.toEqual(
      expect.objectContaining({ stock: 3 }),
    );
  });

  it('rejects an empty cart, an invalid address, and insufficient stock', async () => {
    const address = await fixture.createAddress();
    const emptyResponse = await fixture.agent
      .post('/api/orders')
      .send({ addressId: address.id, paymentMethod: 'paypal' });
    const foreign = await createForeignUserAddress();
    const foreignResponse = await fixture.agent
      .post('/api/orders')
      .send({ addressId: foreign.address.id, paymentMethod: 'paypal' });
    await foreign.cleanup();

    const product = await fixture.createProduct({ stock: 1 });
    await fixture.addToCart(product.id, 2);
    const stockResponse = await fixture.agent
      .post('/api/orders')
      .send({ addressId: address.id, paymentMethod: 'paypal' });

    expect(emptyResponse.status).toBe(400);
    expect(emptyResponse.body).toEqual({ error: 'Cart is empty' });
    expect(foreignResponse.status).toBe(400);
    expect(stockResponse.status).toBe(409);
    expect(stockResponse.body).toEqual({ error: 'Some products are out of stock' });
    await expectOrderCount(fixture.userId, 0);
  });
});

describe('GET /api/orders/:id', () => {
  it('returns an order with its items and hides another user order', async () => {
    const address = await fixture.createAddress();
    const product = await fixture.createProduct();
    const order = await prisma.order.create({
      data: {
        userId: fixture.userId,
        addressId: address.id,
        totalAmount: 25,
        paymentMethod: 'paypal',
        orderItems: { create: { productId: product.id, quantity: 1, price: 25 } },
      },
    });

    const response = await fixture.agent.get(`/api/orders/${order.id}`);
    const missingResponse = await fixture.agent.get('/api/orders/999999');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        id: order.id,
        paymentMethod: 'paypal',
        orderItems: [
          expect.objectContaining({ product: expect.objectContaining({ id: product.id }) }),
        ],
      }),
    );
    expect(missingResponse.status).toBe(404);
  });
});

describe('PATCH /api/orders/:id/cancel', () => {
  it('cancels a pending order and rejects a completed order', async () => {
    const address = await fixture.createAddress();
    const pendingOrder = await prisma.order.create({
      data: { userId: fixture.userId, addressId: address.id, totalAmount: 10 },
    });
    const completedOrder = await prisma.order.create({
      data: { userId: fixture.userId, addressId: address.id, totalAmount: 10, status: 'COMPLETED' },
    });

    const cancelResponse = await fixture.agent.patch(`/api/orders/${pendingOrder.id}/cancel`);
    const completedResponse = await fixture.agent.patch(`/api/orders/${completedOrder.id}/cancel`);

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body).toEqual(
      expect.objectContaining({ id: pendingOrder.id, status: 'CANCELED' }),
    );
    expect(completedResponse.status).toBe(400);
  });
});
