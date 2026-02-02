'use client';
import { useEffect, useState } from 'react';
import { fetchProducts } from '@/lib/fetchProducts';
import type { Product } from '@/types/index';

export default function useClientEffectOnce(url: string) {
  const [product, setProduct] = useState<Product[] | null>(null);

  useEffect(() => {
    let cancelled: boolean = false;

    (async () => {
      try {
        const res = await fetchProducts<Product[]>(url);
        if (!cancelled) setProduct(res);
      } catch {
        if (!cancelled) setProduct(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [url]);
  return product;
}
