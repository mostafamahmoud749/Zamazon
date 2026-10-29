import type Z from 'zod';
import type { ProductResponseSchema } from '@/schemas/Product.schema';


export type Product = Z.infer<typeof ProductResponseSchema>;
export type ProductRating = Product['rating'];