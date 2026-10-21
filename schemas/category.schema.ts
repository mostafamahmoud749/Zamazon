import Z from 'zod';

export const CategoryIdParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Category ID must be a positive integer'),
});

export const CategoriesQuerySchema = Z.object({
  ids: Z.string()
    .max(1100)
    .regex(/^\d+(,\d+)*$/, 'IDs must be comma-separated positive integers')
    .transform((value) => value.split(',').map(Number))
    .pipe(Z.array(Z.number().int().positive().max(2147483647)).max(100))
    .transform((ids) => [...new Set(ids)])
    .optional(),
}).strict();

export const CategoryResponseSchema = Z.object({
  id: Z.number().int().positive(),
  name: Z.string(),
  slug: Z.string(),
  parentId: Z.number().int().positive().nullable(),
  createdAt: Z.iso.datetime(),
});

export const CategoriesResponseSchema = Z.array(CategoryResponseSchema);
