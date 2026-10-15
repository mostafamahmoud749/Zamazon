import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { CategoryIdParamsSchema } from '../schemas/category.schema.js';
import { validateParams } from '../middleware/validateParams.js';

const router = Router();

router.get('/api/categories', async (request, response) => {
  try {
    const categories = await prisma.category.findMany({
      take: 20,
    });
    response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
});

router.get('/api/categories/ancestors', async (request, response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
    });
    response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
});

router.get(
  '/api/categories/:id/childrens',
  validateParams(CategoryIdParamsSchema),
  async (request: Request<{ id: string }>, response) => {
    const id = response.locals.params.id;
    try {
      const categoryChildrens = await prisma.category.findMany({
        where: {
          parentId: id,
        },
      });
      if (categoryChildrens.length === 0) {
        response.status(404).json({ error: 'Category has no childrens' });
        return;
      }
      response.json(categoryChildrens);
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },
);

export default router;
