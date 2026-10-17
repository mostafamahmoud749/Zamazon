import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';
import { csrfAgent } from './helpers/csrf.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';
import { prisma } from '../../prisma/lib/prisma.js';

const app = createApp();

describe('CSRF protection', () => {
  it('issues a stable, non-cacheable token and accepts it only with its session', async () => {
    const agent = request.agent(app);
    const first = await agent.get('/api/auth/csrf-token');
    const second = await agent.get('/api/auth/csrf-token');

    expect(first.status).toBe(200);
    expect(first.headers['cache-control']).toBe('no-store');
    expect(first.headers['set-cookie']).toBeDefined();
    expect(first.body.csrfToken).toEqual(expect.any(String));
    expect(second.body.csrfToken).toBe(first.body.csrfToken);

    const accepted = await agent
      .post('/api/auth/register')
      .set('X-CSRF-Token', first.body.csrfToken)
      .send({});
    expect(accepted.status).toBe(400); // Reaches body validation.

    const otherSession = await csrfAgent(app);
    const rejected = await otherSession
      .post('/api/auth/register')
      .set('X-CSRF-Token', first.body.csrfToken)
      .send({});
    expect(rejected.status).toBe(403);
    expect(rejected.body.code).toBe('EBADCSRFTOKEN');
  });

  it.each(['post', 'put', 'patch', 'delete'] as const)(
    'rejects %s without a token before route handlers run',
    async (method) => {
      const response = await request(app)[method]('/api/addresses').send({});
      expect(response.status).toBe(403);
      expect(response.body.code).toBe('EBADCSRFTOKEN');
    },
  );

  it('rejects incorrect tokens even with a valid session', async () => {
    const agent = await csrfAgent(app);
    const response = await agent
      .post('/api/auth/register')
      .set('X-CSRF-Token', 'incorrect-token')
      .send({});
    expect(response.status).toBe(403);
  });

  it('allows safe reads and preflight requests without a token', async () => {
    expect((await request(app).get('/api/users/me')).status).toBe(401);
    expect((await request(app).head('/api/users/me')).status).toBe(401);
    expect((await request(app).options('/api/addresses')).status).toBe(204);
  });

  it('uses unpredictable OAuth state and rejects a callback with the wrong state', async () => {
    const agent = request.agent(app);
    const redirect = await agent.get('/api/auth/github');
    expect(redirect.status).toBe(302);
    const state = new URL(redirect.headers.location).searchParams.get('state');
    expect(state).toEqual(expect.any(String));
    expect(state!.length).toBeGreaterThan(20);

    const rejected = await agent
      .get('/api/auth/github/callback')
      .query({ code: 'unused-code', state: 'incorrect-state' });
    expect(rejected.status).toBe(403);
  });

  it('rejects stale tokens after login and prevents an authenticated address update', async () => {
    const user = {
      email: `csrf-${crypto.randomUUID()}@example.com`,
      name: 'CSRF Test User',
      password: 'Password123!',
    };
    await registerTestUser(app, user);

    try {
      const agent = await csrfAgent(app);
      const beforeLogin = (await agent.get('/api/auth/csrf-token')).body.csrfToken;
      await loginTestUser(agent, user);
      const afterLogin = (await agent.get('/api/auth/csrf-token')).body.csrfToken;
      expect(afterLogin).not.toBe(beforeLogin);

      const address = await agent.post('/api/addresses').send({
        street: '123 CSRF Street',
        city: 'Cairo',
        state: 'Cairo',
        postalCode: '12345',
        country: 'Egypt',
      });
      expect(address.status).toBe(201);

      const missing = await agent
        .patch(`/api/addresses/${address.body.id}`)
        .unset('X-CSRF-Token')
        .send({ city: 'Changed' });
      expect(missing.status).toBe(403);

      const rejected = await agent
        .patch(`/api/addresses/${address.body.id}`)
        .set('X-CSRF-Token', beforeLogin)
        .send({ city: 'Changed' });
      expect(rejected.status).toBe(403);
      expect(
        (
          await prisma.address.findUniqueOrThrow({
            where: { id: address.body.id },
          })
        ).city,
      ).toBe('Cairo');

      const accepted = await agent
        .patch(`/api/addresses/${address.body.id}`)
        .set('X-CSRF-Token', afterLogin)
        .send({ city: 'Updated' });
      expect(accepted.status).toBe(200);
      expect(accepted.body.city).toBe('Updated');
    } finally {
      await prisma.user.delete({ where: { email: user.email } });
    }
  });
});
