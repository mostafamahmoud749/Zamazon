import { Request, Router } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { validateBody } from '../middleware/validateBody.js';
import { SetDefaultAddressSchema } from '../../schemas/User.schema';

const router = Router();

router.get('/api/users/me', requireAuth, async (request, response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: request.user!.id },
      select: {
        id: true,
        email: true,
        defaultAddressId: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return response.sendStatus(404);
    }

    response.status(200).json(user);
  } catch (error) {
    throw error;
  }
});

router.patch(
  '/api/users/me/default-address',
  requireAuth,
  validateBody(SetDefaultAddressSchema),
  async (request: Request<{}, {}, { defaultAddressId: number }>, response) => {
    const { defaultAddressId } = request.body;

    try {
      const address = await prisma.address.findUnique({
        where: {
          id: defaultAddressId,
          userId: request.user!.id,
        },
      });

      if (!address) {
        return response.status(404).json({ error: 'This Address dosenot exist!' });
      }

      await prisma.user.update({
        where: {
          id: request.user!.id,
        },
        data: {
          defaultAddressId: address.id,
        },
      });

      response.sendStatus(204);
    } catch (error) {
      throw error;
    }
  },
);

export default router;
