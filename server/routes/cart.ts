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
    response.sendStatus(500);
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
      const cartitem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });

      response.status(201).json(cartitem);
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
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
      const updatedCartItem = await prisma.cartItem.update({
        where: { id, userId: request.user!.id },
        data: { quantity },
      });
      response.status(200).json(updatedCartItem);
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
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
      response.sendStatus(500);
    }
  },
);

export default router;
