import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { getCategoryIdsIncludingChildren } from '../utils/category.js';
import { validateQuery } from '../middleware/validateQuery.js';
import { ProductsQuerySchema } from '../../schemas/Product.schema.js';

const router = Router();

router.get('/api/products', validateQuery(ProductsQuerySchema), async (request, response) => {
  const { page, rating, search, filters: selectedCategoryIds, cumulative } = response.locals.query;
  const skip = cumulative ? 0 : 20 * (page - 1);
  const take = cumulative ? page * 20 : 20;

  try {
    const categoryIds = await getCategoryIdsIncludingChildren(selectedCategoryIds);
    const ratedProducts =
      rating > 0
        ? await prisma.review.groupBy({
            by: ['productId'],
            having: { rating: { _avg: { gte: rating } } },
          })
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
                id: { in: ratedProducts.map(({ productId }) => productId) },
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
      skip,
      take,
      orderBy: { id: 'asc' },
    });

    const ratingStats = products.length
      ? await prisma.review.groupBy({
          by: ['productId'],
          where: { productId: { in: products.map(({ id }) => id) } },
          _avg: { rating: true },
          _count: { id: true },
        })
      : [];

    const ratingsByProductId = new Map(
      ratingStats.map((stats) => [
        stats.productId,
        { rate: stats._avg.rating ?? 0, count: stats._count.id },
      ]),
    );

    response.status(200).json(
      products.map((product) => ({
        ...product,
        rating: ratingsByProductId.get(product.id) ?? { rate: 0, count: 0 },
      })),
    );
  } catch (error) {
    throw error;
  }
});

export default router;
