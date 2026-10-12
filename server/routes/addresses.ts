import { Router, Request } from 'express';
import { prisma } from '../../prisma/lib/prisma.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { CreateAddressDto, PatchAddressDto } from '../dtos/Address.dto.js';
import {
  CreateAddressSchema,
  PatchAddressSchema,
  AddressIdParamsSchema,
} from '../schemas/Address.schema.js';
import { validateBody } from '../middleware/validateBody.js';
import { validateParams } from '../middleware/validateParams.js';

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
    throw error;
  }
});

router.post(
  '/api/addresses',
  requireAuth,
  validateBody(CreateAddressSchema),
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
      throw error;
    }
  },
);

router.patch(
  '/api/addresses/:id',
  requireAuth,
  validateParams(AddressIdParamsSchema),
  validateBody(PatchAddressSchema),
  async (request: Request<{ id: string }, {}, PatchAddressDto>, response) => {
    const addressId = response.locals.params.id;
    const userId = request.user!.id;
    const { street, city, state, postalCode, country } = request.body;

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
      throw error;
    }
  },
);

router.delete(
  '/api/addresses/:id',
  requireAuth,
  validateParams(AddressIdParamsSchema),
  async (request: Request<{ id: string }>, response) => {
    const addressId = response.locals.params.id;
    const userId = request.user!.id;

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

      throw error;
    }
  },
);

export default router;
