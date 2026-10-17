import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();
const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

describe('API security middleware', () => {
  it('shares the general limit across API routes and excludes CORS preflights', async () => {
    const limitedApp = createApp();

    for (let attempt = 0; attempt < 300; attempt++) {
      const response = await request(limitedApp).get('/api/users/me');
      expect(response.status).toBe(401);
    }

    const blocked = await request(limitedApp)
      .post('/api/auth/login')
      .set('Origin', frontendOrigin)
      .send({});

    expect(blocked.status).toBe(429);
    expect(blocked.body.error).toBe('Too many requests. Please try again later.');
    expect(blocked.headers['retry-after']).toBeDefined();
    expect(blocked.headers['x-content-type-options']).toBe('nosniff');
    expect(blocked.headers['access-control-allow-origin']).toBe(frontendOrigin);

    const preflight = await request(limitedApp)
      .options('/api/auth/login')
      .set('Origin', frontendOrigin)
      .set('Access-Control-Request-Method', 'POST');

    expect(preflight.status).toBe(204);
    expect((await request(limitedApp).get('/outside-api')).status).toBe(404);
  });

  it('adds security headers to responses', async () => {
    const response = await request(app).get('/api/users/me');

    expect(response.status).toBe(401);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['content-security-policy']).toBeDefined();
    expect(response.headers['x-powered-by']).toBeUndefined();
  });

  it('allows credentialed frontend preflight requests', async () => {
    const response = await request(app)
      .options('/api/auth/login')
      .set('Origin', frontendOrigin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(frontendOrigin);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
    expect(response.headers['access-control-allow-headers']).toContain('content-type');
  });

  it('does not grant another origin permission to read responses', async () => {
    const response = await request(app)
      .get('/api/users/me')
      .set('Origin', 'https://untrusted.example');

    expect(response.status).toBe(401);
    expect(response.headers['access-control-allow-origin']).toBe(frontendOrigin);
    expect(response.headers['access-control-allow-origin']).not.toBe('https://untrusted.example');
  });

  it('blocks excess login attempts before authentication, without limiting other routes', async () => {
    // Invalid bodies exercise the real login limiter without querying the database.
    for (let attempt = 0; attempt < 10; attempt++) {
      const response = await request(app).post('/api/auth/login').send({});
      expect(response.status).toBe(400);
    }

    const blocked = await request(app)
      .post('/api/auth/login')
      .set('Origin', frontendOrigin)
      .send({});

    expect(blocked.status).toBe(429);
    expect(blocked.body.error).toBe('Too many login attempts. Please try again later.');
    expect(blocked.headers['retry-after']).toBeDefined();
    expect(blocked.headers['access-control-allow-origin']).toBe(frontendOrigin);
    expect((await request(app).get('/api/users/me')).status).toBe(401);
  });
});
