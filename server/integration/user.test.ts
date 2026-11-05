import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';
import { csrfAgent } from './helpers/csrf.js';
import { mockUser } from './mocks/user.js';
import { mockAddress } from './mocks/address.js';
import { UserSchema } from '../../schemas/User.schema.js';

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
        image: null,
        createdAt: expect.any(String),
      }),
    );
    expect(UserSchema.safeParse(response.body).success).toBe(true);
  });
  it('should return 401 for unauthenticated requests', async () => {
    const response = await request(app).get('/api/users/me');

    expect(response.status).toBe(401);
  });
});

describe('PATCH /api/users/me/image', () => {
  const image = 'https://res.cloudinary.com/test-cloud/image/upload/v1/avatar.webp';

  it('saves the image URL and returns 204 with no body', async () => {
    const response = await agent.patch('/api/users/me/image').send({ image });

    expect(response.status).toBe(204);
    expect(response.text).toBe('');

    const storedUser = await prisma.user.findUniqueOrThrow({ where: { email: mockUser.email } });
    expect(storedUser.image).toBe(image);
    const userResponse = await agent.get('/api/users/me');
    expect(userResponse.body.image).toBe(image);
    expect(UserSchema.safeParse(userResponse.body).success).toBe(true);
  });

  it('accepts upload URLs longer than 200 characters', async () => {
    const longImage = `https://res.cloudinary.com/test-cloud/image/upload/${'a'.repeat(220)}.webp`;
    const response = await agent.patch('/api/users/me/image').send({ image: longImage });

    expect(response.status).toBe(204);
    const userResponse = await agent.get('/api/users/me');
    expect(userResponse.body.image).toBe(longImage);
    expect(UserSchema.safeParse(userResponse.body).success).toBe(true);
  });

  it.each([
    ['missing image', {}],
    ['null image', { image: null }],
    ['empty image', { image: '' }],
    ['whitespace', { image: '   ' }],
    ['non-string image', { image: 123 }],
    ['malformed URL', { image: 'not-a-url' }],
    ['relative URL', { image: '/avatar.webp' }],
    ['HTTP URL', { image: 'http://example.com/avatar.webp' }],
    ['JavaScript URL', { image: 'javascript:alert(1)' }],
    ['data URL', { image: 'data:image/png;base64,abc' }],
    ['temporary blob URL', { image: 'blob:https://example.com/avatar' }],
    ['oversized URL', { image: `https://example.com/${'a'.repeat(2048)}` }],
  ])('rejects %s without changing the stored image', async (_name, body) => {
    const before = await prisma.user.findUniqueOrThrow({ where: { email: mockUser.email } });
    const response = await agent.patch('/api/users/me/image').send(body);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Invalid request data');
    const after = await prisma.user.findUniqueOrThrow({ where: { email: mockUser.email } });
    expect(after.image).toBe(before.image);
  });

  it('requires authentication', async () => {
    const anonymous = await csrfAgent(app);
    const response = await anonymous.patch('/api/users/me/image').send({ image });

    expect(response.status).toBe(401);
  });

  it.each(['', 'invalid'])('rejects a missing or invalid CSRF token (%j)', async (token) => {
    const before = await prisma.user.findUniqueOrThrow({ where: { email: mockUser.email } });
    const response = await agent
      .patch('/api/users/me/image')
      .set('X-CSRF-Token', token)
      .send({ image });

    expect(response.status).toBe(403);
    const after = await prisma.user.findUniqueOrThrow({ where: { email: mockUser.email } });
    expect(after.image).toBe(before.image);
  });

  it('only updates the signed-in user and ignores extra account fields', async () => {
    const otherUser = await prisma.user.create({
      data: {
        email: `image-owner-${crypto.randomUUID()}@example.com`,
        image: 'https://example.com/other-avatar.webp',
      },
    });

    try {
      const response = await agent.patch('/api/users/me/image').send({
        image,
        id: otherUser.id,
        userId: otherUser.id,
        role: 'ADMIN',
        email: otherUser.email,
      });

      expect(response.status).toBe(204);
      const storedUser = await prisma.user.findUniqueOrThrow({ where: { email: mockUser.email } });
      expect(storedUser.image).toBe(image);
      expect(storedUser.role).toBe('USER');
      expect(await prisma.user.findUniqueOrThrow({ where: { id: otherUser.id } })).toEqual(
        otherUser,
      );
    } finally {
      await prisma.user.delete({ where: { id: otherUser.id } });
    }
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

  it("should return 404 for another user's address", async () => {
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
    const response = await (
      await csrfAgent(app)
    )
      .patch('/api/users/me/default-address')
      .send({ defaultAddressId: 1 });

    expect(response.status).toBe(401);
  });
});
