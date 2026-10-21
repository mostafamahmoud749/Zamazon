'use client';
import { useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FiltersBlock from '@/components/deals/FiltersBlock';
import ProductCard from '@/components/product/ProductCard';
import Filter from '@/components/deals/Filter';
import { X } from 'lucide-react';
import type { Product, Category } from '@/types/index';
import { ProductsQuerySchema } from '@/schemas/Product.schema';
import useInfiniteProducts from '@/hooks/useInfiniteProducts';

type MainDealsProps = {
  products: Product[];
  categories: Category[];
};
export default function MainDeals({ products, categories }: MainDealsProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const query = ProductsQuerySchema.parse({
    filters: searchParams.get('filters') ?? undefined,
    rating: searchParams.get('rating') ?? undefined,
    page: searchParams.get('page') ?? undefined,
  });
  const {
    products: visibleProducts,
    isLoading,
    error,
    sentinelRef,
    loadMore,
  } = useInfiniteProducts(products, query.page, searchParams.toString(), isPending);
  const selectedIds = query.filters;
  const departments = Object.fromEntries(
    categories.map((category) => [String(category.id), selectedIds.includes(category.id)]),
  );
  const departmentNames = Object.fromEntries(
    categories.map((category) => [String(category.id), category.name]),
  );

  function updateUrl(params: URLSearchParams) {
    startTransition(() => {
      const queryString = params.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  }

  function toggleCategory(id: number) {
    const ids = selectedIds.includes(id)
      ? selectedIds.filter((selectedId) => selectedId !== id)
      : [...selectedIds, id];
    const params = new URLSearchParams(searchParams.toString());
    if (ids.length) params.set('filters', JSON.stringify(ids));
    else params.delete('filters');
    params.delete('page');
    updateUrl(params);
  }

  function toggleRating() {
    const params = new URLSearchParams(searchParams.toString());
    if (query.rating === 4) params.delete('rating');
    else params.set('rating', '4');
    params.delete('page');
    updateUrl(params);
  }

  const showActiveFilters = selectedIds.map((id) => (
    <Filter
      key={id}
      name={departmentNames[String(id)] ?? `Category ${id}`}
      value
      toggle={() => toggleCategory(id)}
    />
  ));
  if (query.rating > 0) {
    showActiveFilters.push(
      <Filter
        key="rating"
        name={query.rating === 4 ? '4_up' : `${query.rating} stars & up`}
        value
        toggle={() => {
          const params = new URLSearchParams(searchParams.toString());
          params.delete('rating');
          params.delete('page');
          updateUrl(params);
        }}
      />,
    );
  }

  const showProducts = visibleProducts.map((el) => <ProductCard key={el.id} el={el} deals />);

  return (
    <div className="md:m-auto md:my-8 md:flex md:w-4/5 md:gap-3">
      <div>
        <div className="relative flex items-center gap-2 border-y-2 border-gray-300 md:hidden">
          <span
            onClick={() => setOpen((v) => !v)}
            className="flex-shrink-0 cursor-pointer border-r-1 border-gray-300 p-2 text-sky-800 shadow"
          >
            Filters
          </span>
          <div className="scrollbar-hide relative flex flex-1 items-center gap-1 overflow-x-auto scroll-smooth whitespace-nowrap">
            {showActiveFilters}
          </div>
        </div>

        <div
          className={`fixed bottom-0 left-0 z-48 h-[65vh] w-full overflow-y-auto rounded-t-3xl border-t border-gray-300 bg-white p-4 shadow-xl transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'} md:sticky md:top-4 md:h-auto md:w-fit md:min-w-[250px] md:translate-y-0 md:rounded-none md:border-none md:shadow-none`}
        >
          <div className="flex justify-end border-b-2 border-b-gray-300 p-3 pt-2 md:hidden">
            <X onClick={() => setOpen((v) => !v)} className="cursor-pointer" />
          </div>
          <FiltersBlock
            filtersState={departments}
            labels={departmentNames}
            toggle={(id) => toggleCategory(Number(id))}
            name="departments"
          />
          <FiltersBlock
            filtersState={{ '4_up': query.rating === 4 }}
            toggle={toggleRating}
            name="Rating"
          />
        </div>
      </div>

      <div
        aria-busy={isPending || isLoading}
        className="mx-auto grid w-199/200 grid-cols-2 gap-5 bg-white px-2 py-2 sm:w-full sm:bg-white lg:grid-cols-3 xl:grid-cols-4"
      >
        {isPending && (
          <p role="status" className="col-span-full text-gray-600">
            Updating products…
          </p>
        )}
        {showProducts.length ? (
          showProducts
        ) : (
          <p className="col-span-full py-6 text-center text-gray-600">
            No products match your filters.
          </p>
        )}
        <div ref={sentinelRef} className="col-span-full min-h-12 py-4 text-center">
          {isLoading && <p role="status">Loading more products…</p>}
          {error && (
            <div role="alert">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void loadMore()}
                className="mt-2 cursor-pointer text-sky-800 underline"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
