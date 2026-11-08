import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export function UserDetailsSkeleton() {
  return (
    <SkeletonRegion
      label="Loading your profile"
      className="flex flex-col items-center border-b border-gray-200 pb-8"
    >
      <Skeleton className="size-28 rounded-full" />
      <Skeleton className="mt-4 h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-48" />
    </SkeletonRegion>
  );
}

export function AddressListSkeleton() {
  return (
    <SkeletonRegion label="Loading addresses" className="mt-6 space-y-6">
      {[0, 1].map((index) => (
        <div key={index} className="flex justify-between gap-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-4 w-10" />
        </div>
      ))}
    </SkeletonRegion>
  );
}

export function AddressSectionSkeleton() {
  return (
    <SkeletonRegion label="Loading addresses" className="border-b border-gray-200 py-8">
      <Skeleton className="h-7 w-44" />
    </SkeletonRegion>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="my-8 flex w-full justify-center px-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <UserDetailsSkeleton />
        <AddressSectionSkeleton />
        <Skeleton className="mt-8 h-7 w-44" />
      </div>
    </div>
  );
}
