import type Z from 'zod';
import type { ProductResponseSchema } from '@/schemas/Product.schema';

export type ProductRating = {
  rate: number;
  count: number;
};

export type Product = Z.infer<typeof ProductResponseSchema>;
