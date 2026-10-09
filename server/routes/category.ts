import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

const router = Router();

router.get('/api/categories', async (request, response) => {
  try {
    const categories = await prisma.category.findMany({
      take: 20,
    });
    response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/categories/ansestors', async (request, response) => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        parentId: null,
      },
    });
    response.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/api/categories/:id/children', async (request: Request<{ id: string }>, response) => {
  try {
    const id = Number(request.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      response.status(400).json({ error: 'Invalid category ID' });
      return;
    }

    const categoryChildrens = await prisma.category.findMany({
      where: {
        parentId: id,
      },
    });
    if (!categoryChildrens) {
      response.status(404).json({ error: 'Category has no childrens' });
      return;
    }
    response.json(categoryChildrens);
  } catch (error) {
    console.error('Error fetching category:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
