'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import type { Product } from '@/types/index';
import type { JSX } from 'react';

type HomeProductsProps = {
  products: Product[];
};

export default function HomeProducts({ products }: HomeProductsProps): JSX.Element {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() ?? '';

  const filtered = useMemo((): Product[] => {
    return products.filter((product: Product): boolean => {
      const title = product.title?.toLowerCase() ?? '';
      const description = product.description?.toLowerCase() ?? '';
      return title.includes(searchQuery) || description.includes(searchQuery);
    });
  }, [products, searchQuery]);

  const showProducts: JSX.Element[] = filtered.map((el) => <ProductCard key={el.id} el={el} />);

  return showProducts.length ? (
    <>{showProducts}</>
  ) : (
    <p className="col-span-full py-6 text-center text-gray-600">
      {searchQuery ? 'No products match your search.' : 'Products are unavailable right now.'}
    </p>
  );
}
