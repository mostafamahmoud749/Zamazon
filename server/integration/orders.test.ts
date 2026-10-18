import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import {
  createForeignUserAddress,
  createOrderRouteFixture,
  expectOrderCount,
  synchronizeCartReads,
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
  it('replays a completed checkout without consuming items added later', async () => {
    const address = await fixture.createAddress();
    const product = await fixture.createProduct({ stock: 10 });
    await fixture.addToCart(product.id, 2);
    const key = crypto.randomUUID();
    const payload = { addressId: address.id, paymentMethod: 'credit_card' };
    const first = await fixture.agent.post('/api/orders').set('Idempotency-Key', key).send(payload);
    const replay = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', key)
      .send(payload);

    expect(first.status).toBe(201);
    expect(replay.status).toBe(200);
    expect(replay.body).toEqual(first.body);
    await fixture.addToCart(product.id, 1);
    const laterReplay = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', key)
      .send(payload);
    expect(laterReplay.status).toBe(200);
    expect(laterReplay.body).toEqual(first.body);
    await expectOrderCount(fixture.userId, 1);
    expect((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(8);
    expect(
      (await prisma.cartItem.findMany({ where: { userId: fixture.userId } })).map(
        (item) => item.quantity,
      ),
    ).toEqual([1]);
  });

  it.each([false, true])(
    'handles simultaneous same-key requests (changed details: %s)',
    async (changedDetails) => {
      const address = await fixture.createAddress();
      const product = await fixture.createProduct({ stock: 10 });
      await fixture.addToCart(product.id, 2);
      const key = crypto.randomUUID();
      const releaseReads = synchronizeCartReads();
      let responses;
      try {
        responses = await Promise.all(
          Array.from({ length: 2 }, (_, index) =>
            fixture.agent
              .post('/api/orders')
              .set('Idempotency-Key', key)
              .send({
                addressId: address.id,
                paymentMethod: changedDetails && index === 1 ? 'credit_card' : 'paypal',
              }),
          ),
        );
      } finally {
        releaseReads();
      }
      expect(responses.map(({ status }) => status).sort()).toEqual(
        changedDetails ? [201, 409] : [200, 201],
      );
      if (!changedDetails) expect(responses[0].body).toEqual(responses[1].body);
      await expectOrderCount(fixture.userId, 1);
      expect((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(8);
      expect(await prisma.cartItem.count({ where: { userId: fixture.userId } })).toBe(0);
    },
  );

  it('rejects reuse of a key with a different address or payment method', async () => {
    const address = await fixture.createAddress();
    const otherAddress = await fixture.createAddress();
    const product = await fixture.createProduct({ stock: 10 });
    await fixture.addToCart(product.id, 1);
    const key = crypto.randomUUID();
    const payload = { addressId: address.id, paymentMethod: 'paypal' };
    expect(
      (await fixture.agent.post('/api/orders').set('Idempotency-Key', key).send(payload)).status,
    ).toBe(201);
    for (const changed of [
      { ...payload, addressId: otherAddress.id },
      { ...payload, paymentMethod: 'credit_card' },
    ]) {
      const response = await fixture.agent
        .post('/api/orders')
        .set('Idempotency-Key', key)
        .send(changed);
      expect(response.status).toBe(409);
      expect(response.body.error).toContain('different checkout details');
    }
    await expectOrderCount(fixture.userId, 1);
    expect((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(9);
  });

  it('scopes keys to the authenticated user', async () => {
    const other = await createOrderRouteFixture(app);
    try {
      const key = crypto.randomUUID();
      const ids = [];
      for (const owner of [fixture, other]) {
        const address = await owner.createAddress();
        const product = await owner.createProduct();
        await owner.addToCart(product.id, 1);
        const response = await owner.agent
          .post('/api/orders')
          .set('Idempotency-Key', key)
          .send({ addressId: address.id, paymentMethod: 'paypal' });
        expect(response.status).toBe(201);
        expect(response.body.userId).toBe(owner.userId);
        ids.push(response.body.id);
      }
      expect(ids[0]).not.toBe(ids[1]);
    } finally {
      await other.cleanup();
    }
  }, 15_000);

  it('allows retrying a failed checkout with the same key', async () => {
    const address = await fixture.createAddress();
    const product = await fixture.createProduct({ stock: 1 });
    await fixture.addToCart(product.id, 2);
    const key = crypto.randomUUID();
    const payload = { addressId: address.id, paymentMethod: 'paypal' };
    const failed = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', key)
      .send(payload);
    expect(failed.status).toBe(409);
    await expectOrderCount(fixture.userId, 0);
    await prisma.product.update({ where: { id: product.id }, data: { stock: 5 } });
    const retried = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', key)
      .send(payload);
    expect(retried.status).toBe(201);
    await expectOrderCount(fixture.userId, 1);
    expect((await prisma.product.findUniqueOrThrow({ where: { id: product.id } })).stock).toBe(3);
  });

  it('requires a valid bounded idempotency key', async () => {
    const payload = { addressId: 1, paymentMethod: 'paypal' };
    expect((await fixture.agent.post('/api/orders').send(payload)).status).toBe(400);
    for (const key of ['', 'invalid key', 'x'.repeat(129)]) {
      const response = await fixture.agent
        .post('/api/orders')
        .set('Idempotency-Key', key)
        .send(payload);
      expect(response.status).toBe(400);
    }
    await expectOrderCount(fixture.userId, 0);
  });

  it('checks out the same cart only once when requests arrive together', async () => {
    const address = await fixture.createAddress();
    // Enough stock for both requests: stock checks alone cannot prevent duplicates.
    const product = await fixture.createProduct({ stock: 10 });
    await fixture.addToCart(product.id, 2);

    const releaseReads = synchronizeCartReads();

    let responses;
    try {
      responses = await Promise.all(
        Array.from({ length: 2 }, () =>
          fixture.agent
            .post('/api/orders')
            .set('Idempotency-Key', crypto.randomUUID())
            .send({ addressId: address.id, paymentMethod: 'credit_card' }),
        ),
      );
    } finally {
      releaseReads();
    }

    expect(responses.filter(({ status }) => status === 201)).toHaveLength(1);
    const rejected = responses.filter(({ status }) => status !== 201);
    expect(rejected).toHaveLength(1);
    for (const response of rejected) {
      expect([400, 409]).toContain(response.status);
    }

    await expectOrderCount(fixture.userId, 1);
    await expect(
      prisma.orderItem.count({
        where: { order: { userId: fixture.userId } },
      }),
    ).resolves.toBe(1);
    await expect(
      prisma.cartItem.count({
        where: { userId: fixture.userId },
      }),
    ).resolves.toBe(0);
    await expect(
      prisma.product.findUniqueOrThrow({
        where: { id: product.id },
      }),
    ).resolves.toEqual(expect.objectContaining({ stock: 8 }));
  });

  it('creates an order, applies discounts, decrements stock, and clears the cart', async () => {
    const address = await fixture.createAddress();
    const product = await fixture.createProduct({ price: 20, discount: 10, stock: 5 });
    await fixture.addToCart(product.id, 2);

    const response = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', crypto.randomUUID())
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

  it.each([
    { price: 9.99, discount: 15, quantity: 4, unitPrice: '8.49', total: '33.96' },
    { price: 10, discount: 12.34, quantity: 3, unitPrice: '8.77', total: '26.31' },
    { price: 0.05, discount: 10, quantity: 3, unitPrice: '0.05', total: '0.15' },
  ])(
    'rounds the discounted unit price before calculating the total: %o',
    async ({ price, discount, quantity, unitPrice, total }) => {
      const address = await fixture.createAddress();
      const product = await fixture.createProduct({ price, discount, stock: 10 });
      await fixture.addToCart(product.id, quantity);

      const response = await fixture.agent
        .post('/api/orders')
        .set('Idempotency-Key', crypto.randomUUID())
        .send({ addressId: address.id, paymentMethod: 'credit_card' });

      expect(response.status).toBe(201);
      expect(response.body.totalAmount).toBe(total);
      expect(response.body.orderItems).toEqual([
        expect.objectContaining({ productId: product.id, quantity, price: unitPrice }),
      ]);
    },
  );

  it('rejects an empty cart, an invalid address, and insufficient stock', async () => {
    const address = await fixture.createAddress();
    const emptyResponse = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ addressId: address.id, paymentMethod: 'paypal' });
    const foreign = await createForeignUserAddress();
    const foreignResponse = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ addressId: foreign.address.id, paymentMethod: 'paypal' });
    await foreign.cleanup();

    const product = await fixture.createProduct({ stock: 1 });
    await fixture.addToCart(product.id, 2);
    const stockResponse = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', crypto.randomUUID())
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
  it('restores every ordered quantity once, including inactive products', async () => {
    const address = await fixture.createAddress();
    const firstProduct = await fixture.createProduct({ stock: 5 });
    const secondProduct = await fixture.createProduct({ stock: 8 });
    await fixture.addToCart(firstProduct.id, 2);
    await fixture.addToCart(secondProduct.id, 3);

    const created = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ addressId: address.id, paymentMethod: 'paypal' });
    expect(created.status).toBe(201);
    await prisma.product.update({ where: { id: secondProduct.id }, data: { isActive: false } });

    const canceled = await fixture.agent.patch(`/api/orders/${created.body.id}/cancel`);
    const repeated = await fixture.agent.patch(`/api/orders/${created.body.id}/cancel`);

    expect(canceled.status).toBe(200);
    expect(canceled.body.status).toBe('CANCELED');
    expect(repeated.status).toBe(400);
    await expect(
      prisma.product.findUniqueOrThrow({ where: { id: firstProduct.id } }),
    ).resolves.toEqual(expect.objectContaining({ stock: 5 }));
    await expect(
      prisma.product.findUniqueOrThrow({ where: { id: secondProduct.id } }),
    ).resolves.toEqual(expect.objectContaining({ stock: 8, isActive: false }));
  });

  it('restores stock only once when cancellation requests arrive together', async () => {
    const address = await fixture.createAddress();
    const product = await fixture.createProduct({ stock: 5 });
    await fixture.addToCart(product.id, 2);
    const created = await fixture.agent
      .post('/api/orders')
      .set('Idempotency-Key', crypto.randomUUID())
      .send({ addressId: address.id, paymentMethod: 'paypal' });
    expect(created.status).toBe(201);

    const responses = await Promise.all([
      fixture.agent.patch(`/api/orders/${created.body.id}/cancel`),
      fixture.agent.patch(`/api/orders/${created.body.id}/cancel`),
    ]);

    expect(responses.map((response) => response.status).sort()).toEqual([200, 400]);
    await expect(prisma.product.findUniqueOrThrow({ where: { id: product.id } })).resolves.toEqual(
      expect.objectContaining({ stock: 5 }),
    );
  });

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
