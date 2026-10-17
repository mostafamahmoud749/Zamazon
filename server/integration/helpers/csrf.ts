import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';

export async function refreshCsrfToken(agent: ReturnType<typeof request.agent>) {
  const response = await agent.get('/api/auth/csrf-token');
  expect(response.status).toBe(200);
  expect(response.body.csrfToken).toEqual(expect.any(String));
  agent.set('X-CSRF-Token', response.body.csrfToken);
  return response.body.csrfToken as string;
}

export async function csrfAgent(app: Express) {
  const agent = request.agent(app);
  await refreshCsrfToken(agent);
  return agent;
}
