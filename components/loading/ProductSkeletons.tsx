import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export function ProductCardSkeleton({ deals = true }: { deals?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="flex h-80 w-full min-w-0 flex-col justify-between overflow-hidden rounded-md bg-gray-100 p-2 shadow-md"
    >
      <Skeleton className="h-40 min-h-0 w-full flex-1" />
      {deals ? (
        <div className="mx-1 my-2 space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-3/4" />
          <Skeleton className="h-4 w-24 max-w-full" />
          <Skeleton className="h-8 w-24 max-w-full rounded-full" />
        </div>
      ) : (
        <Skeleton className="mx-auto mt-4 mb-1 h-4 w-4/5" />
      )}
    </div>
  );
}

export function ProductSkeletons({ count = 8, deals = true }: { count?: number; deals?: boolean }) {
  return Array.from({ length: count }, (_, index) => (
    <ProductCardSkeleton key={index} deals={deals} />
  ));
}

export function HomePageSkeleton() {
  return (
    <div className="flex flex-1 flex-col md:bg-gray-200">
      <SkeletonRegion
        label="Loading products"
        className="mx-auto grid w-199/200 grid-cols-2 gap-5 px-6 py-4 md:w-4/5 md:grid-cols-4 md:bg-white"
      >
        <ProductSkeletons deals={false} />
      </SkeletonRegion>
    </div>
  );
}

export function DealsPageSkeleton() {
  return (
    <div className="md:m-auto md:my-8 md:flex md:w-4/5 md:gap-3">
      <SkeletonRegion
        label="Loading product filters"
        className="hidden w-[250px] shrink-0 space-y-4 p-2 md:block"
      >
        <Skeleton className="my-2 h-5 w-28" />
        {Array.from({ length: 7 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-4/5" />
        ))}
        <Skeleton className="mt-8 h-5 w-20" />
        <Skeleton className="h-4 w-28" />
      </SkeletonRegion>
      <div className="border-y-2 border-gray-200 p-2 md:hidden">
        <Skeleton className="h-5 w-16" />
      </div>
      <SkeletonRegion
        label="Loading deals"
        className="mx-auto grid w-199/200 grid-cols-2 gap-5 bg-white px-2 py-2 sm:w-full lg:grid-cols-3 xl:grid-cols-4"
      >
        <ProductSkeletons />
      </SkeletonRegion>
    </div>
  );
}

export function ProductDetailsSkeleton() {
  return (
    <SkeletonRegion label="Loading product details" className="mx-auto my-8 w-11/12 md:w-5/6">
      <div className="flex flex-col gap-6 md:flex-row md:gap-4">
        <Skeleton className="mx-auto aspect-square w-full max-w-[450px] md:flex-1" />
        <div className="min-w-0 flex-1 space-y-4 md:flex-2">
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-6 h-9 w-28" />
          <Skeleton className="h-10 w-full rounded-full" />
          <div className="space-y-3 border-t border-gray-200 pt-4">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
      <div className="mt-8 space-y-5 rounded-xl border border-gray-200 bg-white p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </SkeletonRegion>
  );
}
