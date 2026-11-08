import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function OrderHeader({
  orderId,
  createdAt,
}: {
  orderId: number;
  createdAt?: string;
}) {
  return (
    <>
      <Link
        href="/orders"
        className="focus-visible:outline-dark_blue inline-flex items-center gap-1 text-sm text-sky-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Your orders
      </Link>

      <header className="mt-5 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Order details</h1>
          <p className="mt-2 text-sm text-gray-600">
            Order <span className="font-medium text-gray-900">#{orderId}</span>
            {createdAt && (
              <>
                <span className="mx-2 text-gray-300" aria-hidden="true">
                  |
                </span>
                Placed on{' '}
                {new Date(createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </>
            )}
          </p>
        </div>
      </header>
    </>
  );
}
