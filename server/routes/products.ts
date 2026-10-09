import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { getCategoryIdsIncludingChildren } from '../utils/category.js';

const router = Router();

router.get('/api/products', async (request, response) => {
  try {
    const page = Number(request.query.page ?? 1);
    const rating = Number(request.query.rating ?? 0);
    const search = typeof request.query.search === 'string' ? request.query.search.trim() : '';

    const filters = request.query.filters ? JSON.parse(String(request.query.filters)) : [];
    const selectedCategoryIds = Array.isArray(filters)
      ? filters.map(Number).filter((id: number) => !isNaN(id))
      : [];
    const categoryIds = await getCategoryIdsIncludingChildren(selectedCategoryIds);

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
          categoryIds.length > 0
            ? {
                categoryId: {
                  in: categoryIds,
                },
              }
            : {},
          { isActive: true },
        ],
      },
      skip: (page - 1) * 20,
      take: 20,
    });

    response.status(200).json(products);
  } catch (err) {
    response.sendStatus(400);
  }
});

export default router;
