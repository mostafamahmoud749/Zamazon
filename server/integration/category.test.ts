import request from 'supertest';
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';

const app = createApp();

let id: number | undefined;

beforeAll(async () => {
  await prisma.category.create({
    data: {
      name: 'Electronics',
      parentId: null,
      slug: 'electronics',
    },
  });

  id = await prisma.category
    .findFirst({
      where: {
        name: 'Electronics',
      },
    })
    .then((category) => category?.id);

  await prisma.category.create({
    data: {
      name: 'Clothing',
      parentId: id,
      slug: 'clothing',
    },
  });
});

afterAll(async () => {
  await prisma.category.deleteMany({
    where: {},
  });
  await prisma.$disconnect();
});

describe('GET /api/categories', () => {
  it('should return 200 and an array of categories', async () => {
    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Electronics',
          slug: 'electronics',
          createdAt: expect.any(String),
          parentId: null,
          id: expect.any(Number),
        }),
        expect.objectContaining({
          name: 'Clothing',
          slug: 'clothing',
          createdAt: expect.any(String),
          parentId: id,
          id: expect.any(Number),
        }),
      ]),
    );
  });
});

describe('GET /api/categories/ancestors', () => {
  it('should return 200 and an array of ancestor categories', async () => {
    const response = await request(app).get('/api/categories/ancestors');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Electronics',
          slug: 'electronics',
          createdAt: expect.any(String),
          parentId: null,
          id: expect.any(Number),
        }),
      ]),
    );
  });
});

describe('GET /api/categories/:id/childrens', () => {
  it('should return 200 and an array of child categories', async () => {
    const response = await request(app).get(`/api/categories/${id}/childrens`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Clothing',
          slug: 'clothing',
          createdAt: expect.any(String),
          parentId: id,
          id: expect.any(Number),
        }),
      ]),
    );
  });
});
