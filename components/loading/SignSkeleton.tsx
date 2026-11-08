import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export default function SignSkeleton() {
  return (
    <SkeletonRegion
      label="Loading sign-in form"
      className="mx-auto w-full max-w-[400px] space-y-5 rounded-md border border-gray-200 bg-white p-6 shadow-sm md:mt-6"
    >
      <Skeleton className="h-7 w-44" />
      {[0, 1, 2].map((index) => (
        <div key={index} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
      <Skeleton className="h-10 w-full rounded-full" />
      <Skeleton className="mx-auto h-4 w-3/4" />
    </SkeletonRegion>
  );
}
