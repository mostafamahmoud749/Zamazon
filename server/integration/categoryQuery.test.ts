import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock('../../prisma/lib/prisma.js', () => ({
  prisma: { category: { findMany } },
}));

import categoryRouter from '../routes/category.js';

const app = express();
app.use(categoryRouter);

beforeEach(() => findMany.mockReset());

describe('category ID lookup', () => {
  it('returns all categories without an ID filter', async () => {
    const categories = Array.from({ length: 25 }, (_, index) => ({
      id: index + 1,
      name: `Category ${index + 1}`,
    }));
    findMany.mockResolvedValue(categories);
    const response = await request(app).get('/api/categories');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(categories);
    expect(findMany).toHaveBeenCalledWith({ where: {} });
  });

  it('looks up all selected IDs', async () => {
    const categories = Array.from({ length: 21 }, (_, index) => ({
      id: index + 1,
      name: `Category ${index + 1}`,
    }));
    findMany.mockResolvedValue(categories);
    const ids = categories.map(({ id }) => id);
    const response = await request(app).get('/api/categories').query({ ids: ids.join(',') });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(categories);
    expect(findMany).toHaveBeenCalledWith({ where: { id: { in: ids } } });
  });

  it('deduplicates IDs and returns an empty list when none match', async () => {
    findMany.mockResolvedValue([]);
    const response = await request(app).get('/api/categories?ids=3,3,8');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
    expect(findMany).toHaveBeenCalledWith({ where: { id: { in: [3, 8] } } });
  });

  it.each([
    '', '0', '-1', '1.5', 'abc', '1,,2', '1,', '2147483648',
    Array.from({ length: 101 }, (_, index) => index + 1).join(','),
  ])('rejects invalid or excessive IDs: %s', async (ids) => {
    const response = await request(app).get('/api/categories').query({ ids });
    expect(response.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });

  it('rejects repeated ids parameters', async () => {
    const response = await request(app).get('/api/categories?ids=1&ids=2');
    expect(response.status).toBe(400);
    expect(findMany).not.toHaveBeenCalled();
  });
});
