import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateProductDto, PatchProductDto } from '../dtos/Product.dto.js';
import { validateParams } from '../middleware/validateParams.js';
import {
  CreateProductSchema,
  ProducIdParamsSchema,
  UpdateProductSchema,
} from '../../schemas/Product.schema.js';
import { validateBody } from '../middleware/validateBody.js';
import { isPrismaError } from '../utils/isPrismaError.js';

const router = Router();

router.get('/api/products/:id', validateParams(ProducIdParamsSchema), async (request, response) => {
  const id = response.locals.params.id;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!product) {
      return response.sendStatus(404);
    }

    const rate = await prisma.review.aggregate({
      where: { productId: id },
      _avg: { rating: true },
      _count: { id: true },
    });

    response.json({
      ...product,
      rating: {
        rate: rate._avg.rating ?? 0,
        count: rate._count.id,
      },
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.post(
  '/api/products',
  requireAuth,
  validateBody(CreateProductSchema),
  async (request: Request<{}, {}, CreateProductDto>, response) => {
    const { categoryId, stock, title, description, price, discount, image, slug } = request.body;
    const userId = request.user!.id;

    try {
      const product = await prisma.product.create({
        data: {
          userId,
          categoryId: categoryId ?? null,
          stock,
          title,
          description,
          price,
          discount: discount ?? 0,
          image,
          slug,
        },
      });

      response.status(201).json(product);
    } catch (error) {
      console.error(error);
      if (isPrismaError(error, 'P2002')) {
        return response.status(409).json({ error: 'A product with this slug already exists' });
      }

      if (isPrismaError(error, 'P2003')) {
        return response.status(404).json({ error: 'Category does not exist' });
      }

      throw error;
    }
  },
);

router.patch(
  '/api/products/:id',
  requireAuth,
  validateParams(ProducIdParamsSchema),
  validateBody(UpdateProductSchema),
  async (request: Request<{ id: string }, {}, PatchProductDto>, response) => {
    const id = response.locals.params.id;
    const { categoryId, stock, title, description, price, discount, image, slug } = request.body;
    const userId = request.user!.id;

    try {
      const savedProduct = await prisma.product.findUnique({
        where: { id, userId },
      });

      if (!savedProduct) {
        response.sendStatus(404);
        return;
      }

      const product = await prisma.product.update({
        where: { id, userId },
        data: {
          categoryId: categoryId ?? savedProduct.categoryId,
          stock: stock ?? savedProduct.stock,
          title: title ?? savedProduct.title,
          description: description ?? savedProduct.description,
          price: price ?? savedProduct.price,
          discount: discount ?? savedProduct.discount,
          image: image ?? savedProduct.image,
          slug: slug ?? savedProduct.slug,
        },
      });

      response.status(200).json(product);
    } catch (error) {
      console.error(error);
      if (isPrismaError(error, 'P2002')) {
        return response.status(409).json({ error: 'A product with this slug already exists' });
      }

      if (isPrismaError(error, 'P2003')) {
        return response.status(404).json({ error: 'Category does not exist' });
      }

      throw error;
    }
  },
);

router.delete(
  '/api/products/:id',
  requireAuth,
  validateParams(ProducIdParamsSchema),
  async (request: Request<{ id: string }>, response) => {
    const id = response.locals.params.id;
    const userId = request.user!.id;

    try {
      const savedProduct = await prisma.product.findUnique({
        where: { id, userId },
      });

      if (!savedProduct) {
        response.sendStatus(404);
        return;
      }

      const product = await prisma.product.update({
        where: { id, userId },
        data: {
          isActive: false,
        },
      });

      response.status(200).json(product);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export default router;
