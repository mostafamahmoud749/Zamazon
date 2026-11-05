import { ArrowRight, Package } from 'lucide-react';
import Link from 'next/link';

const orders = [
  {
    id: 1048,
    date: 'November 5, 2026',
    total: '$129.99',
    status: 'Pending',
    statusStyle: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  {
    id: 1042,
    date: 'November 3, 2026',
    total: '$84.50',
    status: 'Shipped',
    statusStyle: 'bg-sky-50 text-sky-800 ring-sky-200',
  },
  {
    id: 1036,
    date: 'October 28, 2026',
    total: '$56.00',
    status: 'Delivered',
    statusStyle: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  },
  {
    id: 1029,
    date: 'October 22, 2026',
    total: '$39.99',
    status: 'Cancelled',
    statusStyle: 'bg-rose-50 text-rose-800 ring-rose-200',
  },
];

export default function OrdersPage() {
  return (
    <div className="text-dark mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your orders</h1>
        <p className="mt-2 text-sm text-slate-500">Check the status of your recent orders.</p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="group focus-visible:outline-dark_blue flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-colors hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-4 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="bg-gray text-light_blue flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <Package size={20} aria-hidden="true" />
                  </span>
                  <h2 className="text-base font-semibold">Order #{order.id}</h2>
                </div>
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${order.statusStyle}`}
                >
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                  {order.status}
                </span>
              </div>

              <dl className="my-6 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="mb-1 text-slate-500">Order placed</dt>
                  <dd className="font-medium">{order.date}</dd>
                </div>
                <div className="text-right">
                  <dt className="mb-1 text-slate-500">Total</dt>
                  <dd className="font-semibold tabular-nums">{order.total}</dd>
                </div>
              </dl>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-medium text-sky-700 group-hover:text-sky-900">
                <span>View order details</span>
                <ArrowRight size={18} aria-hidden="true" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
