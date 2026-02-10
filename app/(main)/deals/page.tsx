import MainDeals from '@/components/deals/MainDeals';
import { fetchProducts } from '@/lib/fetchProducts';
import type { Product } from '@/types/index';
import type { JSX } from 'react';

export default async function DealsPage(): Promise<JSX.Element> {

  const res = await fetchProducts('https://dummyjson.com/products?limit=100');
  const products: Product[] = Array.isArray(res) ? (res as Product[]) : [];

  return (
    <>
      <MainDeals products={products} />
    </>
  );
}
