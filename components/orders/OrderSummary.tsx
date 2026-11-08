import type { ReactNode } from 'react';

export default function OrderSummary({
  total,
  children,
}: {
  total: number;
  children: ReactNode;
}) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-6">
      <div className="p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <dl className="mt-5 space-y-3 text-sm">
          <div className="flex justify-between gap-4 text-gray-600">
            <dt>Items subtotal</dt>
            <dd className="tabular-nums">${total.toFixed(2)}</dd>
          </div>
          <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-base font-semibold">
            <dt>Order total</dt>
            <dd className="tabular-nums">${total.toFixed(2)}</dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-gray-500">All prices are in USD.</p>
      </div>
      {children}
    </aside>
  );
}
