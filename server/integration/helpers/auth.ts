import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';
import { csrfAgent, refreshCsrfToken } from './csrf.js';

type TestUser = {
  email: string;
  name: string;
  password: string;
};

export async function registerTestUser(app: Express, user: TestUser) {
  const agent = await csrfAgent(app);
  const registerResponse = await agent.post('/api/auth/register').send(user);
  expect(registerResponse.status).toBe(201);

  return {
    email: user.email,
    password: user.password,
  };
}

export async function loginTestUser(agent: ReturnType<typeof request.agent>, user: TestUser) {
  await refreshCsrfToken(agent);
  const loginResponse = await agent.post('/api/auth/login').send({
    email: user.email,
    password: user.password,
  });
  expect(loginResponse.status).toBe(200);
  // Passport regenerates the session on login, so fetch its new token.
  await refreshCsrfToken(agent);
}
