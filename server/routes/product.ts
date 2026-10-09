import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateProductDto, PatchProductDto } from '../dtos/Product.dto.js';

const router = Router();

router.get('/api/products/:id', async (request, response) => {
  const id = Number(request.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    response.sendStatus(400);
    return;
  }

  try {
    const product = await prisma.product.findUnique({
      where: {
        id,
        isActive: true,
      },
    });

    if (!product) {
      response.sendStatus(404);
      return;
    }

    response.status(200).json(product);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

router.post(
  '/api/products',
  requireAuth,
  async (request: Request<{}, {}, CreateProductDto>, response) => {
    const { categoryId, stock, title, description, price, discount, image, slug } = request.body;
    const userId = request.user!.id;

    try {
      const product = await prisma.product.create({
        data: {
          userId,
          categoryId: categoryId ?? 0,
          stock,
          title,
          description,
          price,
          discount: discount ?? 0.0,
          image,
          slug,
        },
      });

      response.status(201).json(product);
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  },
);

router.patch(
  '/api/products/:id',
  requireAuth,
  async (request: Request<{ id: string }, {}, PatchProductDto>, response) => {
    const id = Number(request.params.id);
    const { categoryId, stock, title, description, price, discount, image, slug } = request.body;
    const userId = request.user!.id;

    if (!Number.isInteger(id) || id <= 0) {
      response.sendStatus(400);
      return;
    }

    if (Object.keys(request.body).length === 0) {
      response.sendStatus(400);
      return;
    }

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
      response.sendStatus(500);
    }
  },
);

router.delete(
  '/api/products/:id',
  requireAuth,
  async (request: Request<{ id: string }>, response) => {
    const id = Number(request.params.id);
    const userId = request.user!.id;

    if (!Number.isInteger(id) || id <= 0) {
      response.sendStatus(400);
      return;
    }

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
      response.sendStatus(500);
    }
  },
);

export default router;
