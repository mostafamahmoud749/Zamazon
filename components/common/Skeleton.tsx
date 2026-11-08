import type { ReactNode } from 'react';

export default function Skeleton({ className = '' }: { className?: string }) {
  const rounding = className.includes('rounded') ? '' : 'rounded-md';
  return (
    <div
      aria-hidden="true"
      className={`bg-gray-200 motion-safe:animate-pulse ${rounding} ${className}`}
    />
  );
}

export function SkeletonRegion({
  label,
  className = '',
  children,
}: {
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
