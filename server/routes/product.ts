import { Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';

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
        id: id,
      },
    });

    if (!product) {
      response.sendStatus(404);
      return;
    }

    response.status(200).send(product);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

export default router;
