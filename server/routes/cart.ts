import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateCartDto } from '../dtos/Cart.dto.js';
import {
  CreateCartItemSchema,
  CartIDParamsSchema,
  UpdateCartItemSchema,
} from '../schemas/Cart.schema.js';
import { validateBody } from '../middleware/validateBody.js';
import { validateParams } from '../middleware/validateParams.js';
import { checkAvailableProductQuantity } from '../utils/checkAvilableProductQuantity.js';
import { Prisma } from '../../generated/prisma/client.js';
import { MAX_CART_QUANTITY } from '../schemas/Cart.schema.js';

const router = Router();

router.get('/api/cart/items', requireAuth, async (request, response) => {
  try {
    const cart = await prisma.cartItem.findMany({
      where: { userId: request.user!.id },
      select: {
        id: true,
        quantity: true,
        product: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            image: true,
            discount: true,
            stock: true,
          },
        },
      },
    });

    response.status(200).json(cart);
  } catch (error) {
    console.error(error);
    throw error;
  }
});

router.post(
  '/api/cart/items',
  requireAuth,
  validateBody(CreateCartItemSchema),
  async (request: Request<{}, {}, CreateCartDto>, response) => {
    const { productId, quantity } = request.body;
    const userId = request.user!.id;

    try {
      const result = await prisma.$transaction(
        async (transaction) => {
          const product = await transaction.product.findUnique({
            where: { id: productId },
            select: { stock: true, isActive: true },
          });

          if (!product || !product.isActive) {
            throw new Error('PRODUCT_UNAVAILABLE');
          }

          const existingItem = await transaction.cartItem.findUnique({
            where: {
              productId_userId: { productId, userId },
            },
            select: { quantity: true },
          });

          const mergedQuantity = (existingItem?.quantity ?? 0) + quantity;

          if (mergedQuantity > MAX_CART_QUANTITY) {
            throw new Error('CART_QUANTITY_LIMIT');
          }

          if (mergedQuantity > product.stock) {
            throw new Error('INSUFFICIENT_STOCK');
          }

          const cartItem = await transaction.cartItem.upsert({
            where: {
              productId_userId: { productId, userId },
            },
            create: { userId, productId, quantity },
            update: { quantity: mergedQuantity },
          });

          return { cartItem, created: !existingItem };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
      );

      response.status(result.created ? 201 : 200).json(result.cartItem);
    } catch (error) {
      if (error instanceof Error && error.message === 'PRODUCT_UNAVAILABLE') {
        return response.status(404).json({ error: 'Product is unavailable' });
      }

      if (error instanceof Error && error.message === 'CART_QUANTITY_LIMIT') {
        return response.status(400).json({
          error: `Cart quantity cannot exceed ${MAX_CART_QUANTITY}`,
        });
      }

      if (error instanceof Error && error.message === 'INSUFFICIENT_STOCK') {
        return response.status(409).json({ error: 'Not enough stock available' });
      }

      throw error;
    }
  },
);

router.patch(
  '/api/cart/items/:id',
  requireAuth,
  validateParams(CartIDParamsSchema),
  validateBody(UpdateCartItemSchema),
  async (request: Request<{ id: string }, {}, { quantity: number }>, response) => {
    const id = response.locals.params.id;
    const { quantity } = request.body;

    try {
      const cartItem = await prisma.cartItem.findFirst({
        where: { id, userId: request.user!.id },
        select: { productId: true },
      });

      if (!cartItem) {
        return response.sendStatus(404);
      }

      if (!(await checkAvailableProductQuantity(cartItem.productId, quantity))) {
        return response.status(400).send({ error: 'Not enough stock available' });
      }

      const updatedCartItem = await prisma.cartItem.update({
        where: { id, userId: request.user!.id },
        data: { quantity },
      });
      response.status(200).json(updatedCartItem);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

router.delete(
  '/api/cart/items/:id',
  requireAuth,
  validateParams(CartIDParamsSchema),
  async (request: Request<{ id: string }>, response) => {
    const id = response.locals.params.id;

    try {
      await prisma.cartItem.delete({
        where: { id, userId: request.user!.id },
      });
      response.sendStatus(200);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
);

export default router;
