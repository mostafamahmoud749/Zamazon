import request from 'supertest';
import { describe, expect, it, afterAll } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';

const app = createApp();

const mockUser = {
  email: `user-${crypto.randomUUID()}@example.com`,
  name: 'Test User',
  password: 'Password123!',
};

const deleteTestUser = () => {
  afterAll(async () => {
    await prisma.user.deleteMany({
      where: {
        email: mockUser.email,
      },
    });
  });
};

async function registerTestUser() {
  const response = await request(app).post('/api/auth/register').send(mockUser);

  expect(response.status).toBe(201);
  const { email, password } = mockUser;
  return { email, password };
}

describe('POST /api/auth/login', () => {
  it('should return 200 for valid credentials', async () => {
    const validCredentials = await registerTestUser();
    const response = await request(app).post('/api/auth/login').send(validCredentials);
    expect(response.status).toBe(200);
  });

  it('should return 401 for invalid credentials', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'invalid@example.com',
      password: 'invalidpassword',
    });
    expect(response.status).toBe(401);
  });

  it.each([
    [{ email: '', password: 'password123' }],
    [{ email: 'user@example.com', password: '' }],
    [{ email: 'invalid-email', password: 'password123' }],
    [{ email: 'user@example.com', password: '123' }],
  ])('rejects invalid credentials: %o', async (credentials) => {
    const response = await request(app).post('/api/auth/login').send(credentials);

    expect(response.status).toBe(400);
  });

  deleteTestUser();
});

describe('POST /api/auth/register', () => {
  it('should return 201 for valid registration', async () => {
    const response = await request(app).post('/api/auth/register').send(mockUser);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      name: mockUser.name,
      email: mockUser.email,
    });
  });

  it('should return 409 for duplicate email', async () => {
    await request(app).post('/api/auth/register').send(mockUser);

    const response = await request(app).post('/api/auth/register').send(mockUser);
    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: 'Email already exists' });
  });

  it.each([
    [{ email: '', password: 'Password123!', name: 'Test User' }],
    [{ email: 'invalid-email', password: 'Password123!', name: 'Test User' }],
    [{ email: 'user@example.com', password: '', name: 'Test User' }],
    [{ email: 'user@example.com', password: '123', name: 'Test User' }],
  ])('rejects invalid registration data: %o', async (data) => {
    const response = await request(app).post('/api/auth/register').send(data);
    expect(response.status).toBe(400);
  });

  deleteTestUser();
});

describe('GET /api/auth/github', () => {
  it('redirects to GitHub OAuth', async () => {
    const response = await request(app).get('/api/auth/github').redirects(0);

    expect(response.status).toBe(302);
    expect(response.headers.location).toContain('github.com/login/oauth/authorize');
  });

  deleteTestUser();
});
