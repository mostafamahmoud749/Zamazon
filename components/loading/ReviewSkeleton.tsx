import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export default function ReviewSkeleton() {
  return (
    <SkeletonRegion label="Loading reviews" className="divide-y divide-gray-200">
      {[0, 1, 2].map((index) => (
        <div key={index} className="space-y-3 py-5 first:pt-0">
          <div className="flex justify-between gap-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </SkeletonRegion>
  );
}
