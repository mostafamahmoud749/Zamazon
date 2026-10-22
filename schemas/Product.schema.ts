import Z from 'zod';

export const ProducIdParamsSchema = Z.object({
  id: Z.coerce.number().int().positive('Product ID must be a positive integer'),
});

export const ProductsQuerySchema = Z.object({
  page: Z.coerce.number().int().min(1).default(1),
  rating: Z.coerce.number().min(0).max(5).default(0),
  search: Z.string().trim().max(100, 'Search must be at most 100 characters').default(''),
  filters: Z.preprocess((value) => {
    if (value === undefined || value === '') return [];
    if (typeof value !== 'string') return value;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }, Z.array(Z.coerce.number().int().positive()).default([])),
  cumulative: Z.preprocess((value) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  }, Z.boolean().default(false)),
}).strict();

export const CreateProductSchema = Z.object({
  categoryId: Z.coerce.number().int().positive('Category ID must be a positive integer').optional(),
  stock: Z.coerce.number().int().nonnegative('Stock must be a non-negative integer'),
  title: Z.string().min(1, 'Title is required').max(255, 'Title must be at most 255 characters'),
  description: Z.string()
    .min(1, 'Description is required')
    .max(1000, 'Description must be at most 1000 characters'),
  price: Z.coerce.number().nonnegative('Price must be a non-negative number'),
  discount: Z.coerce
    .number()
    .min(0, 'Discount must be at least 0')
    .max(100, 'Discount must be at most 100')
    .optional(),
  image: Z.string().url('Image must be a valid URL'),
  slug: Z.string().min(1, 'Slug is required').max(255, 'Slug must be at most 255 characters'),
});

export const UpdateProductSchema = CreateProductSchema.partial().refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update',
);


export const ProductResponseSchema = CreateProductSchema.extend({
  image: Z.union([CreateProductSchema.shape.image, Z.string().regex(/^\/(?!\/)\S+$/)]),
  id: Z.number().int().positive(),
  userId: Z.number().int().positive(),
  categoryId: Z.number().int().positive().nullable(),
  price: Z.string().regex(/^\d+(\.\d+)?$/),
  discount: Z.string().regex(/^\d+(\.\d+)?$/).nullable(),
  isActive: Z.boolean(),
  createdAt: Z.iso.datetime(),
});

export const ProductsResponseSchema = Z.array(ProductResponseSchema);
