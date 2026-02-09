import MainDeals from '@/components/deals/MainDeals';
import { fetchProducts } from '@/lib/fetchProducts';
import type { Product } from '@/types/index';
import type { JSX } from 'react';

export default async function DealsPage(): Promise<JSX.Element> {
<<<<<<< HEAD
  const res = await fetchProducts('https://fakestoreapi.com/products');
=======
  const res = await fetchProducts('https://dummyjson.com/products?limit=100');
>>>>>>> 6809f93 (changed api from fakestore to dummyjson)
  const products: Product[] = Array.isArray(res) ? (res as Product[]) : [];

  return (
    <>
      <MainDeals products={products} />
    </>
  );
}
