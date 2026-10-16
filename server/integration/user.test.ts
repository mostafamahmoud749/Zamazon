import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';
import { mockUser } from './mocks/user.js';

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
