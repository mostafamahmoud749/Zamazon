import type { Express } from 'express';
import request from 'supertest';
import { expect } from 'vitest';

type TestUser = {
  email: string;
  name: string;
  password: string;
};

export async function registerTestUser(app: Express, user: TestUser) {
  const registerResponse = await request(app).post('/api/auth/register').send(user);
  expect(registerResponse.status).toBe(201);

  return {
    email: user.email,
    password: user.password,
  };
}

export async function loginTestUser(agent: ReturnType<typeof request.agent>, user: TestUser) {
  const loginResponse = await agent.post('/api/auth/login').send({
    email: user.email,
    password: user.password,
  });
  expect(loginResponse.status).toBe(200);
}
