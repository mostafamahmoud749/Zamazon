import Skeleton, { SkeletonRegion } from '@/components/common/Skeleton';

export default function HeaderSkeleton({ isMobile }: { isMobile: boolean }) {
  return (
    <SkeletonRegion
      label="Loading navigation"
      className={isMobile ? 'bg-dark_blue p-2' : 'bg-dark'}
    >
      <div className={`flex items-center gap-5 ${isMobile ? 'h-8 justify-between' : 'h-15 px-6'}`}>
        <Skeleton className="h-6 w-24 bg-gray-600" />
        {!isMobile && <Skeleton className="h-10 min-w-0 flex-1 bg-gray-600" />}
        <Skeleton className="h-6 w-28 bg-gray-600" />
      </div>
      {isMobile && <Skeleton className="my-2 h-10 w-full bg-gray-600" />}
      <div
        className={`bg-dark_blue flex items-center gap-5 overflow-hidden ${isMobile ? 'h-8' : 'h-[34px] px-6'}`}
      >
        {[0, 1, 2, 3, 4].map((index) => (
          <Skeleton key={index} className="h-4 w-20 shrink-0 bg-gray-600" />
        ))}
      </div>
    </SkeletonRegion>
  );
}
