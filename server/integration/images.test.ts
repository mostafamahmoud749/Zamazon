import request from 'supertest';
import { runInNewContext } from 'node:vm';
import { v2 as cloudinary } from 'cloudinary';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';
import { loginTestUser, registerTestUser } from './helpers/auth.js';
import { csrfAgent } from './helpers/csrf.js';

const app = createApp();
const agent = request.agent(app);
const user = {
  email: `images-${crypto.randomUUID()}@example.com`,
  name: 'Image Upload User',
  password: 'Password123!',
};
let userId: number;

beforeAll(async () => {
  vi.stubEnv('CLOUDINARY_CLOUD_NAME', 'test-cloud');
  vi.stubEnv('CLOUDINARY_API_KEY', 'test-key');
  vi.stubEnv('CLOUDINARY_API_SECRET', 'test-secret');
  await registerTestUser(app, user);
  await loginTestUser(agent, user);
  userId = (await prisma.user.findUniqueOrThrow({ where: { email: user.email } })).id;
});

afterAll(async () => {
  vi.unstubAllEnvs();
  await prisma.user.deleteMany({ where: { email: user.email } });
  await prisma.$disconnect();
});

describe('POST /api/images/upload-signature', () => {
  it('requires authentication', async () => {
    const anonymous = await csrfAgent(app);
    expect((await anonymous.post('/api/images/upload-signature')).status).toBe(401);
  });

  it('requires a session CSRF token', async () => {
    const response = await agent
      .post('/api/images/upload-signature')
      .set('X-CSRF-Token', 'invalid');
    expect(response.status).toBe(403);
  });

  it('signs a unique image ID for the logged-in user and fixes upload restrictions', async () => {
    const response = await agent.post('/api/images/upload-signature').send({
      public_id: 'another-users-image',
      overwrite: true,
      allowed_formats: 'svg',
      transformation: 'w_10000',
      eval: '',
    });
    expect(response.status).toBe(200);
    expect(response.headers['cache-control']).toBe('no-store');
    expect(response.body.uploadUrl).toBe('https://api.cloudinary.com/v1_1/test-cloud/image/upload');
    expect(response.body.apiKey).toBe('test-key');
    expect(response.body.params).toEqual({
      public_id: expect.stringMatching(
        new RegExp(`^zamazon/users/${userId}/images/[\\da-f-]{36}$`),
      ),
      timestamp: expect.any(Number),
      type: 'upload',
      overwrite: false,
      allowed_formats: 'jpg,jpeg,png,webp',
      transformation: 'c_limit,w_1600,h_1600/f_webp,q_auto',
      eval: 'if (resource_info.bytes > 5242880) { throw new Error("Images must be 5 MB or smaller"); }',
    });
    expect(Math.abs(response.body.params.timestamp - Math.floor(Date.now() / 1000))).toBeLessThan(
      5,
    );
    expect(response.body.signature).toBe(
      cloudinary.utils.api_sign_request(response.body.params, 'test-secret'),
    );
    expect(JSON.stringify(response.body)).not.toContain('test-secret');

    const second = await agent.post('/api/images/upload-signature');
    expect(second.body.params.public_id).not.toBe(response.body.params.public_id);
  });

  it('reports missing configuration', async () => {
    vi.stubEnv('CLOUDINARY_API_SECRET', '');
    try {
      const response = await agent.post('/api/images/upload-signature');
      expect(response.status).toBe(503);
      expect(response.body).toEqual({ error: 'Image storage is not configured' });
    } finally {
      vi.stubEnv('CLOUDINARY_API_SECRET', 'test-secret');
    }
  });

  it('binds a 5 MiB per-file rule into the signature so the client cannot remove it', async () => {
    const response = await agent.post('/api/images/upload-signature');
    const { params, signature } = response.body;

    for (const bytes of [1, 5242879, 5242880]) {
      expect(() => runInNewContext(params.eval, { resource_info: { bytes } })).not.toThrow();
    }
    expect(() => runInNewContext(params.eval, { resource_info: { bytes: 5242881 } })).toThrow(
      'Images must be 5 MB or smaller',
    );

    const withoutRule = { ...params };
    delete withoutRule.eval;
    expect(cloudinary.utils.api_sign_request(withoutRule, 'test-secret')).not.toBe(signature);
    expect(cloudinary.utils.api_sign_request({ ...params, eval: '' }, 'test-secret')).not.toBe(
      signature,
    );
    const withoutOptimization = { ...params };
    delete withoutOptimization.transformation;
    expect(cloudinary.utils.api_sign_request(withoutOptimization, 'test-secret')).not.toBe(
      signature,
    );
  });

  it('removes the unused GET routes and the backend file upload endpoint', async () => {
    expect((await agent.get('/api/images')).status).toBe(404);
    expect((await agent.get(`/api/images/${crypto.randomUUID()}`)).status).toBe(404);
    expect((await agent.post('/api/images')).status).toBe(404);
  });
});
