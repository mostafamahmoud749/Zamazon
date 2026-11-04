import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';
import { csrfAgent } from './helpers/csrf.js';
import { mockUser } from './mocks/user.js';
import { mockAddress } from './mocks/address.js';

const app = createApp();
const agent = request.agent(app);

beforeAll(async () => {
  await registerTestUser(app, mockUser);
  await loginTestUser(agent, mockUser);
});

afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: mockUser.email } });
  await prisma.$disconnect();
});

describe('GET /api/users/me', () => {
  it('should return 200 and the authenticated user', async () => {
    const response = await agent.get('/api/users/me');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({
        email: mockUser.email,
        name: mockUser.name,
        role: 'USER',
        createdAt: expect.any(String),
      }),
    );
  });
  it('should return 401 for unauthenticated requests', async () => {
    const response = await request(app).get('/api/users/me');

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/users/me/default-address', () => {
  it('should set the default address and return 204', async () => {
    const addressResponse = await agent.post('/api/addresses').send(mockAddress[0]);
    expect(addressResponse.status).toBe(201);

    const response = await agent
      .patch('/api/users/me/default-address')
      .send({ defaultAddressId: addressResponse.body.id });

    expect(response.status).toBe(204);
    expect(response.text).toBe('');

    const userResponse = await agent.get('/api/users/me');
    expect(userResponse.body.defaultAddressId).toBe(addressResponse.body.id);
  });

  it('should return 400 for an invalid address ID', async () => {
    const response = await agent
      .patch('/api/users/me/default-address')
      .send({ defaultAddressId: 0 });

    expect(response.status).toBe(400);
  });

  it('should return 404 for another user\'s address', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: `default-address-${crypto.randomUUID()}@example.com`,
        addresses: { create: mockAddress[0] },
      },
      include: { addresses: true },
    });

    try {
      const response = await agent
        .patch('/api/users/me/default-address')
        .send({ defaultAddressId: otherUser.addresses[0].id });

      expect(response.status).toBe(404);
    } finally {
      await prisma.user.delete({ where: { id: otherUser.id } });
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    const response = await (await csrfAgent(app))
      .patch('/api/users/me/default-address')
      .send({ defaultAddressId: 1 });

    expect(response.status).toBe(401);
  });
});
