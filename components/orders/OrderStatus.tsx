import { Package, PackageX } from 'lucide-react';

export default function OrderStatus({ status }: { status: string }) {
  const isCanceled = status === 'CANCELED';
  const statusText: Record<string, { title: string; description: string }> = {
    PENDING: { title: 'Order placed', description: 'Your order has been received.' },
    CANCELED: { title: 'Order canceled', description: 'This order has been canceled.' },
  };

  const details = statusText[status] ?? {
    title: `Order status: ${status.replaceAll('_', ' ').toLowerCase()}`,
    description: '',
  };
  
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
      <div className="flex items-start gap-4" role="status">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${isCanceled ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-700'}`}
        >
          {isCanceled ? (
            <PackageX size={23} aria-hidden="true" />
          ) : (
            <Package size={23} aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 id="order-status-heading" className="text-lg font-semibold">
            {details.title}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-gray-600">{details.description}</p>
        </div>
      </div>
    </section>
  );
}
