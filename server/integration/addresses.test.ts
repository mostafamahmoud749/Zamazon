import { csrfAgent } from './helpers/csrf.js';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { mockUser } from './mocks/user.js';
import { mockAddress, invalidAddress } from './mocks/address.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';

const app = createApp();
const agent = request.agent(app);

const addAddress = async (address = mockAddress[0]) => {
  const response = await agent.post('/api/addresses').send(address);

  expect(response.status).toBe(201);
  expect(response.body).toEqual(expect.objectContaining(address));

  return response.body.id;
};

beforeAll(async () => {
  await registerTestUser(app, mockUser);
  await loginTestUser(agent, mockUser);
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: mockUser.email } });
  await prisma.$disconnect();
});

describe('GET /api/addresses', () => {
  it('should return 200 and an array of addresses', async () => {
    await addAddress();

    const response = await agent.get('/api/addresses');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(mockAddress[0])]),
    );
  });
});

describe('POST /api/addresses', () => {
  it('should return 201 and the created address', async () => {
    const response = await agent.post('/api/addresses').send(mockAddress[1]);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(expect.objectContaining(mockAddress[1]));
  });

  it('should return 400 for invalid address data', async () => {
    const response = await agent.post('/api/addresses').send(invalidAddress);

    expect(response.status).toBe(400);
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await (await csrfAgent(app)).post('/api/addresses').send(mockAddress[2]);

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/addresses/:id', () => {
  it('should return 200 and the updated address', async () => {
    const addressId = await addAddress();
    const response = await agent.patch(`/api/addresses/${addressId}`).send({ city: 'New City' });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ city: 'New City' }));
  });

  it('should return 400 for invalid address data', async () => {
    const addressId = await addAddress();
    const response = await agent.patch(`/api/addresses/${addressId}`).send({ city: '' });

    expect(response.status).toBe(400);
  });

  it('should return 404 for non-existent address', async () => {
    const response = await agent.patch(`/api/addresses/999999`).send({ city: 'New City' });

    expect(response.status).toBe(404);
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await (await csrfAgent(app)).patch('/api/addresses/999999').send({ city: 'New City' });

    expect(response.status).toBe(401);
  });
});

describe('DELETE /api/addresses/:id', () => {
  it('should return 204 for successful deletion', async () => {
    const addressId = await addAddress();
    const response = await agent.delete(`/api/addresses/${addressId}`);

    expect(response.status).toBe(204);
  });

  it('should return 404 for non-existent address', async () => {
    const response = await agent.delete(`/api/addresses/999999`);

    expect(response.status).toBe(404);
  });

  it('should return 409 when the address is used by an order', async () => {
    const address = await addAddress(mockAddress[2]);
    const user = await prisma.user.findUniqueOrThrow({
      where: { email: mockUser.email },
    });

    await prisma.order.create({
      data: {
        userId: user.id,
        addressId: address,
        totalAmount: 10,
        paymentMethod: 'credit_card',
      },
    });

    try {
      const response = await agent.delete(`/api/addresses/${address}`);

      expect(response.status).toBe(409);
      expect(response.body).toEqual({ error: 'Address is used by an order' });
    } finally {
      await prisma.order.deleteMany({ where: { addressId: address } });
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await (await csrfAgent(app)).delete('/api/addresses/999999');

    expect(response.status).toBe(401);
  });
});
