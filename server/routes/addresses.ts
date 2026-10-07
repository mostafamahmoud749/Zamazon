import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { Prisma } from '../../generated/prisma/client.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateAddressDto, PatchAddressDto } from '../dtos/Address.dto.js';

const router = Router();

router.get('/api/addresses', requireAuth, async (request, response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: request.user!.id },
      select: {
        id: true,
        street: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
      },
    });

    response.status(200).json(addresses);
  } catch (error) {
    console.error(error);
    response.sendStatus(500);
  }
});

router.post(
  '/api/addresses',
  requireAuth,
  async (request: Request<{}, {}, CreateAddressDto>, response) => {
    const { street, city, state, postalCode, country } = request.body;
    const userId = request.user!.id;

    try {
      const address = await prisma.address.create({
        data: {
          userId,
          street,
          city,
          state,
          postalCode,
          country,
        },
      });

      response.status(201).json(address);
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  },
);

router.patch(
  '/api/addresses/:id',
  requireAuth,
  async (request: Request<{ id: string }, {}, PatchAddressDto>, response) => {
    const addressId = Number(request.params.id);
    const userId = request.user!.id;
    const { street, city, state, postalCode, country } = request.body;

    if (!Number.isInteger(addressId) || addressId <= 0 || Object.keys(request.body).length === 0) {
      return response.sendStatus(400);
    }

    try {
      const existingAddress = await prisma.address.findFirst({
        where: { id: addressId, userId },
      });

      if (!existingAddress) {
        return response.sendStatus(404);
      }

      const address = await prisma.address.update({
        where: {
          id: addressId,
        },
        data: {
          street: street ?? existingAddress.street,
          city: city ?? existingAddress.city,
          state: state ?? existingAddress.state,
          postalCode: postalCode ?? existingAddress.postalCode,
          country: country ?? existingAddress.country,
        },
      });

      response.status(200).json(address);
    } catch (error) {
      console.error(error);
      response.sendStatus(500);
    }
  },
);

router.delete(
  '/api/addresses/:id',
  requireAuth,
  async (request: Request<{ id: string }>, response) => {
    const addressId = Number(request.params.id);
    const userId = request.user!.id;

    if (!Number.isInteger(addressId) || addressId <= 0) {
      return response.sendStatus(400);
    }

    try {
      const result = await prisma.address.deleteMany({
        where: { id: addressId, userId },
      });

      if (result.count === 0) {
        return response.sendStatus(404);
      }

      response.sendStatus(204);
    } catch (error) {
      console.error(error);

      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        return response.status(409).json({ error: 'Address is used by an order' });
      }

      response.sendStatus(500);
    }
  },
);

export default router;
