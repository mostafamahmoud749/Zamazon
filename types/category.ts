import type Z from 'zod';
import type { CategoryResponseSchema } from '@/schemas/category.schema';

export type Category = Z.infer<typeof CategoryResponseSchema>;
