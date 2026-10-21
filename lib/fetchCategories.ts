import { CategoriesResponseSchema } from '@/schemas/category.schema';
import type { Category } from '@/types/category';

export async function fetchCategories(url: string): Promise<Category[]> {
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (!res.ok) throw new Error(`Could not fetch categories (${res.status})`);

  const data: unknown = await res.json();
  return CategoriesResponseSchema.parse(data);
}
