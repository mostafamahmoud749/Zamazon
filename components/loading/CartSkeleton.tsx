import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export default function CartSkeleton() {
  return (
    <SkeletonRegion label="Loading your cart" className="mb-5 bg-white px-3 py-4 md:px-8">
      <div className="mb-5 flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
        <Skeleton className="h-7 w-60 max-w-full" />
        <Skeleton className="h-10 w-full rounded-full md:w-44" />
      </div>
      <Skeleton className="mb-4 hidden h-9 w-48 md:block" />
      <div className="divide-y divide-gray-100 border-t border-gray-200">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex gap-4 py-5">
            <Skeleton className="h-[135px] w-[145px] shrink-0" />
            <div className="min-w-0 flex-1 space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </SkeletonRegion>
  );
}
