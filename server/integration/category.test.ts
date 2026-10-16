import request from 'supertest';
import { describe, expect, it, afterAll, beforeAll } from 'vitest';
import { createApp } from '../app.js';
import { prisma } from '../../prisma/lib/prisma.js';

const app = createApp();
const suffix = crypto.randomUUID();

let parentId: number | undefined;
let childId: number | undefined;

beforeAll(async () => {
  await prisma.category.create({
    data: {
      name: `Electronics ${suffix}`,
      parentId: null,
      slug: `electronics-${suffix}`,
    },
  });

  parentId = await prisma.category
    .findFirst({
      where: {
        name: `Electronics ${suffix}`,
      },
    })
    .then((category) => category?.id);

  await prisma.category
    .create({
      data: {
        name: `Clothing ${suffix}`,
        parentId,
        slug: `clothing-${suffix}`,
      },
    })
    .then((category) => {
      childId = category.id;
    });
});

afterAll(async () => {
  await prisma.category.deleteMany({
    where: {
      id: {
        in: [childId, parentId].filter(
          (categoryId): categoryId is number => categoryId !== undefined,
        ),
      },
    },
  });
});

describe('GET /api/categories', () => {
  it('should return 200 and an array of categories', async () => {
    const response = await request(app).get('/api/categories');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: `Electronics ${suffix}`,
          slug: `electronics-${suffix}`,
          createdAt: expect.any(String),
          parentId: null,
          id: expect.any(Number),
        }),
        expect.objectContaining({
          name: `Clothing ${suffix}`,
          slug: `clothing-${suffix}`,
          createdAt: expect.any(String),
          parentId,
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
          name: `Electronics ${suffix}`,
          slug: `electronics-${suffix}`,
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
    const response = await request(app).get(`/api/categories/${parentId}/childrens`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: `Clothing ${suffix}`,
          slug: `clothing-${suffix}`,
          createdAt: expect.any(String),
          parentId,
          id: expect.any(Number),
        }),
      ]),
    );
  });
});
