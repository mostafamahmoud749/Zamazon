import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';
import { csrfAgent, refreshCsrfToken } from './helpers/csrf.js';

const app = createApp();
const user = {
  email: `logout-${crypto.randomUUID()}@example.com`,
  name: 'Logout Test User',
  password: 'Password123!',
};

describe('POST /api/auth/logout', () => {
  beforeAll(async () => {
    await registerTestUser(app, user);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
  });

  it('clears the cookie and invalidates the session, including replay of its old cookie', async () => {
    const agent = await csrfAgent(app);
    const login = await agent.post('/api/auth/login').send({
      email: user.email,
      password: user.password,
    });
    expect(login.status).toBe(200);
    const cookies = login.headers['set-cookie'] as unknown as string[];
    const sessionCookie = cookies
      .find((cookie) => cookie.startsWith('connect.sid='))!
      .split(';')[0];
    const token = await refreshCsrfToken(agent);
    expect((await agent.get('/api/users/me')).status).toBe(200);

    const logout = await agent.post('/api/auth/logout');

    expect(logout.status).toBe(204);
    expect(logout.text).toBe('');
    expect(logout.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/^connect\.sid=; Path=\/; Expires=Thu, 01 Jan 1970/),
      ]),
    );
    expect((await agent.get('/api/users/me')).status).toBe(401);
    expect((await request(app).get('/api/users/me').set('Cookie', sessionCookie)).status).toBe(401);

    const staleToken = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', sessionCookie)
      .set('X-CSRF-Token', token);
    expect(staleToken.status).toBe(403);
    expect(staleToken.body.code).toBe('EBADCSRFTOKEN');

    await loginTestUser(agent, user);
    expect((await agent.get('/api/users/me')).status).toBe(200);
  });

  it.each(['missing', 'incorrect'])(
    'rejects a %s CSRF token without logging the user out',
    async (kind) => {
      const agent = await csrfAgent(app);
      await loginTestUser(agent, user);

      const logoutRequest = agent.post('/api/auth/logout');
      if (kind === 'missing') logoutRequest.unset('X-CSRF-Token');
      else logoutRequest.set('X-CSRF-Token', 'incorrect-token');
      const response = await logoutRequest;

      expect(response.status).toBe(403);
      expect(response.body.code).toBe('EBADCSRFTOKEN');
      expect((await agent.get('/api/users/me')).status).toBe(200);
    },
  );

  it('returns 204 for an anonymous session with a valid CSRF token', async () => {
    const agent = await csrfAgent(app);
    expect((await agent.post('/api/auth/logout')).status).toBe(204);
    expect((await agent.get('/api/users/me')).status).toBe(401);

    await refreshCsrfToken(agent);
    expect((await agent.post('/api/auth/logout')).status).toBe(204);
  });
});
