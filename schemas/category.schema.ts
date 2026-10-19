import Z from 'zod';

export const CategoryIdParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Category ID must be a positive integer'),
});