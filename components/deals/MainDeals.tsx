'use client';
import { useEffect, useMemo, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import FiltersBlock from '@/components/deals/FiltersBlock';
import ProductCard from '@/components/product/ProductCard';
import Filter from '@/components/deals/Filter';
import { X } from 'lucide-react';

import type {
  DealsFiltersState,
  Product,
  DealsActiveFilter,
  DealsFilterGroup,
} from '@/types/index';
import { JSX } from 'react';
type MainDealsProps = {
  products: Product[];
};
export default function MainDeals({ products }: MainDealsProps): JSX.Element {
  const searchParams = useSearchParams();
  const pathname: string = usePathname();

  const [filtersState, setFiltersState] = useState<DealsFiltersState>({
    rating: { '4_up': false },
    departments: {},
  });
  const [open, setOpen] = useState<boolean>(false);
  const [filtersReady, setFiltersReady] = useState<boolean>(false);

  const activeFilters = useMemo<DealsActiveFilter[]>(
    () =>
      Object.entries(filtersState).flatMap(([group, items]) =>
        Object.entries(items)
          .filter(([, value]) => value)
          .map(([key]) => ({ group: group as DealsFilterGroup, key })),
      ),
    [filtersState],
  );

  // 1) initialize from products + URL, and mark ready ONCE
  useEffect((): void => {
    // build departments map from products
    const departments: Record<string, boolean> = {};
    products.forEach((p: Product): void => {
      departments[p.category] = false;
    });

    let initial: DealsFiltersState = {
      rating: { '4_up': false },
      departments,
    };

    const filtersParam: string | null = searchParams.get('filters');
    if (filtersParam) {
      try {
        const parsed = JSON.parse(filtersParam);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        arr.forEach(({ group, key }: { group: DealsFilterGroup; key: string }) => {
          if (group === 'rating') {
            if (key === '4_up') initial.rating['4_up'] = true;
            return;
          }

          if (Object.prototype.hasOwnProperty.call(initial.departments, key)) {
            initial.departments[key] = true;
          }
        });
      } catch {
        // ignore parse errors
      }
    }

    setFiltersState((prev: DealsFiltersState): DealsFiltersState => {
      const prevStr: string = JSON.stringify(prev);
      const nextStr: string = JSON.stringify(initial);
      return prevStr === nextStr ? prev : initial;
    });

    setFiltersReady(true);
  }, [products, searchParams]); // runs once per navigation / products change

  // 2) sync URL ONLY after filters are ready
  useEffect((): void => {
    if (!filtersReady) return; // don't touch URL while initializing

    const newFiltersString: string = JSON.stringify(activeFilters);
    const params = new URLSearchParams(window.location.search);
    const currentFiltersString: string = params.get('filters') ?? '';

    if (currentFiltersString === newFiltersString) return;

    if (activeFilters.length === 0) {
      params.delete('filters');
    } else {
      params.set('filters', newFiltersString);
    }
    window.history.replaceState(null, '', `${pathname}?${params.toString()}`);
  }, [activeFilters, filtersReady, pathname]);

  // 3) filtering logic: only run when ready
  const filteredProducts = useMemo((): Product[] => {
    if (!filtersReady) return products;

    if (activeFilters.length === 0) return products;

    const has4Up: boolean = activeFilters.some((f) => f.group === 'rating' && f.key === '4_up');
    const departmentFilters: DealsActiveFilter[] = activeFilters.filter(
      (f) => f.group === 'departments',
    );

    return products.filter((product: Product): boolean | void => {
      if (!product.rating?.rate) return;
      if (has4Up && product.rating?.rate < 4) return false;
      if (departmentFilters.length === 0) return true;
      return departmentFilters.some((f) => f.key === product.category);
    });
  }, [products, activeFilters, filtersReady]);
  const showProducts: JSX.Element[] = filteredProducts.map((el) => (
    <ProductCard key={el.id} el={el} />
  ));

  const showActiveFilters: JSX.Element[] = activeFilters.map(({ group, key }) => (
    <Filter key={group + key} name={key} value toggle={() => toggle(group, key)} />
  ));

  function toggle(group: DealsFilterGroup, key: string): void {
    setFiltersState((prev: DealsFiltersState): DealsFiltersState => {
      if (group === 'rating') {
        return {
          ...prev,
          rating: {
            ...prev.rating,
            '4_up': !prev.rating['4_up'],
          },
        };
      }

      return {
        ...prev,
        departments: {
          ...prev.departments,
          [key]: !prev.departments[key],
        },
      };
    });
  }
  // function toggle(group:DealsFilterGroup, key:string) {
  //   setFiltersState((prev:DealsFiltersState):DealsFiltersState => ({
  //     ...prev,
  //     [group]: {
  //       ...prev[group],
  //       [key]: !prev[group][key],
  //     },
  //   }));
  // }
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
            filtersState={filtersState.departments}
            toggle={(key) => toggle('departments', key)}
            name="departments"
          />
          <FiltersBlock
            filtersState={filtersState.rating}
            toggle={(key) => toggle('rating', key)}
            name="Rating"
          />
        </div>
      </div>

      <div className="mx-auto grid w-199/200 grid-cols-2 gap-5 px-6 py-2 sm:w-full sm:bg-white sm:p-0 lg:grid-cols-3 xl:grid-cols-4">
        {/* optional: small loading/flicker guard */}
        {!filtersReady ? <p>Loading filters…</p> : showProducts}
      </div>
    </div>
  );
}
