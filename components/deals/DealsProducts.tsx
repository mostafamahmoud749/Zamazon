'use client';

import Button from '@/components/common/Button';
import ProductCard from '@/components/product/ProductCard';
import { ProductSkeletons } from '@/components/loading/ProductSkeletons';
import useInfiniteProducts from '@/hooks/useInfiniteProducts';
import type { Product } from '@/types/index';

type DealsProductsProps = {
  products: Product[];
  initialPage: number;
  queryString: string;
  isPending: boolean;
};

export default function DealsProducts({
  products,
  initialPage,
  queryString,
  isPending,
}: DealsProductsProps) {
  const {
    products: visibleProducts,
    isLoading,
    error,
    sentinelRef,
    loadMore,
  } = useInfiniteProducts(products, initialPage, queryString, isPending);

  const showProducts = visibleProducts.map((el) => <ProductCard key={el.id} el={el} deals />);

  return (
    <div
      aria-busy={isPending || isLoading}
      className="mx-auto grid w-199/200 grid-cols-2 gap-5 bg-white px-2 py-2 sm:w-full sm:bg-white lg:grid-cols-3 xl:grid-cols-4"
    >
      {isPending ? (
        <>
          <span role="status" className="sr-only">
            Updating products
          </span>
          <ProductSkeletons count={Math.max(4, Math.min(visibleProducts.length, 8))} />
        </>
      ) : showProducts.length ? (
        showProducts
      ) : (
        <p className="col-span-full py-6 text-center text-gray-600">
          No products match your filters.
        </p>
      )}
      {isLoading && !isPending && <ProductSkeletons count={4} />}
      <div ref={sentinelRef} className="col-span-full min-h-12 py-4 text-center">
        {isLoading && (
          <span role="status" className="sr-only">
            Loading more products
          </span>
        )}
        {error && (
          <div role="alert">
            <p>{error}</p>
            <Button
              type="button"
              onClick={loadMore}
              className="mt-2 cursor-pointer text-sky-800 underline"
            >
              Try again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
