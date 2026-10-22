import { ProductResponseSchema, ProductsResponseSchema } from '@/schemas/Product.schema';
import type { Product } from '@/types/product';

export async function fetchProducts(url: string, signal?: AbortSignal): Promise<Product[]> {
  const res = await fetch(url, { next: { revalidate: 600 }, signal });
  if (!res.ok) throw new Error(`Could not fetch products (${res.status})`);

  const data: unknown = await res.json();
  return ProductsResponseSchema.parse(data);
}

export async function fetchProduct(url: string): Promise<Product | null> {
  const res = await fetch(url, { next: { revalidate: 600 } });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Could not fetch product (${res.status})`);

  const data: unknown = await res.json();
  return ProductResponseSchema.parse(data);
}
