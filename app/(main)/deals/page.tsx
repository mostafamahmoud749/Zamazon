import MainDeals from '@/components/deals/MainDeals';
import { fetchProducts } from '@/lib/fetchProducts';
import type { Product } from '@/types/product';
import type { JSX } from 'react';

export default async function DealsPage(): Promise<JSX.Element> {
  const res = await fetchProducts('https://fakestoreapi.com/products');
  const products: Product[] = Array.isArray(res) ? (res as Product[]) : [];

  return (
    <>
      <MainDeals products={products} />
    </>
  );
}
