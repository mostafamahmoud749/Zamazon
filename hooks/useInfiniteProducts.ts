'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchProducts } from '@/lib/fetchProducts';
import type { Product } from '@/types';

export default function useInfiniteProducts(
  initialProducts: Product[],
  initialPage: number,
  queryString: string,
  paused: boolean,
) {
  const [products, setProducts] = useState(initialProducts);
  const [hasMore, setHasMore] = useState(initialProducts.length === 20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const sentinelRef = useRef<HTMLDivElement>(null);
  const nextPage = useRef(initialPage + 1);
  const inFlight = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);

  const loadMore = useCallback(async () => {
    if (inFlight.current || !hasMore || paused) return;
    inFlight.current = true;
    const controller = new AbortController();
    controllerRef.current = controller;
    setIsLoading(true);
    setError('');

    try {
      const params = new URLSearchParams(queryString);
      params.set('page', String(nextPage.current));
      const batch = await fetchProducts(`/api/products?${params}`, controller.signal);
      if (controller.signal.aborted) return;

      setProducts((previous) => {
        const ids = new Set(previous.map((product) => product.id));
        return [...previous, ...batch.filter((product) => !ids.has(product.id))];
      });
      nextPage.current += 1;
      setHasMore(batch.length === 20);
    } catch {
      if (!controller.signal.aborted) setError('Could not load more products. Please try again.');
    } finally {
      inFlight.current = false;
      if (!controller.signal.aborted) setIsLoading(false);
    }
  }, [hasMore, paused, queryString]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || isLoading || error || paused) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: '300px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoading, error, paused, loadMore]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { products, hasMore, isLoading, error, sentinelRef, loadMore };
}
