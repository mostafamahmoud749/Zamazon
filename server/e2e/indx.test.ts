import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

const app = createApp();

describe('Auth status route', () => {
  it('returns 401 when the request is unauthenticated', async () => {
    const response = await request(app).get('/api/auth/status');

    expect(response.status).toBe(401);
  });
});
