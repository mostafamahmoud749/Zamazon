import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export function OrdersListSkeleton() {
  return (
    <SkeletonRegion
      label="Loading your orders"
      className="divide-y divide-gray-200 border-y border-gray-200"
    >
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-3 py-5 md:grid-cols-[minmax(0,1fr)_8rem_7rem_9rem] md:gap-6 md:py-6"
        >
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-36 max-w-full" />
          </div>
          <Skeleton className="ml-auto h-4 w-16 md:ml-0" />
          <Skeleton className="h-5 w-20 md:ml-auto" />
          <Skeleton className="ml-auto h-4 w-28" />
        </div>
      ))}
    </SkeletonRegion>
  );
}

export function OrdersPageSkeleton() {
  return (
    <div className="text-dark mx-auto my-4 w-11/12 max-w-6xl bg-white px-4 py-5 md:px-8 md:py-6">
      <Skeleton className="mb-6 h-9 w-44" />
      <OrdersListSkeleton />
    </div>
  );
}

export function OrderDetailsSkeleton() {
  return (
    <SkeletonRegion
      label="Loading your order"
      className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6"
    >
      <div className="min-w-0 space-y-5">
        <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <Skeleton className="size-11 shrink-0 rounded-xl" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-40 max-w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-100 p-5 sm:px-6">
            <Skeleton className="h-5 w-40" />
          </div>
          <div className="divide-y divide-gray-100 px-5 sm:px-6">
            {Array.from({ length: 2 }, (_, index) => (
              <div key={index} className="flex gap-4 py-6 sm:gap-5">
                <Skeleton className="size-20 shrink-0 rounded-xl sm:size-24" />
                <div className="min-w-0 flex-1 space-y-3 pt-1">
                  <Skeleton className="h-5 w-4/5" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-6 rounded-2xl border border-gray-200 bg-white p-5 sm:grid-cols-2 sm:p-6">
          {[0, 1].map((index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="mb-4 h-5 w-36" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        <Skeleton className="h-6 w-36" />
        <div className="flex justify-between gap-6">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex justify-between gap-6 border-t border-gray-200 pt-4">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-10 w-full rounded-full" />
      </div>
    </SkeletonRegion>
  );
}

export function OrderDetailsPageSkeleton() {
  return (
    <div className="mx-auto my-6 w-11/12 max-w-6xl md:my-8">
      <Skeleton className="h-4 w-24" />
      <div className="mt-5 mb-6 space-y-3">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-64 max-w-full" />
      </div>
      <OrderDetailsSkeleton />
    </div>
  );
}
