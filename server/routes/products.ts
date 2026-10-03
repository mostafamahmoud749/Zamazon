import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/products', async (request, response) => {
  try {
    const page = Number(request.query.page ?? 1);
    const rating = Number(request.query.rating ?? 0);
    const search = typeof request.query.search === 'string' ? request.query.search.trim() : '';

    const filters = request.query.filters ? JSON.parse(String(request.query.filters)) : [];
    const catagoryIds = Array.isArray(filters)
      ? filters.map(Number).filter((id: number) => !isNaN(id))
      : [];

    const products = await prisma.product.findMany({
      where: {
        AND: [
          search
            ? {
                OR: [
                  { title: { contains: search, mode: 'insensitive' } },
                  { description: { contains: search, mode: 'insensitive' } },
                ],
              }
            : {},
          rating > 0
            ? {
                reviews: {
                  some: {
                    rating: {
                      gte: rating,
                    },
                  },
                },
              }
            : {},
          catagoryIds.length > 0
            ? {
                categoryId: {
                  in: catagoryIds,
                },
              }
            : {},
        ],
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    response.status(200).send(products);
  } catch (err) {
    response.sendStatus(400);
  }
});

export default router;