import Link from 'next/link';

const orders = [
  {
    id: 1048,
    date: 'November 5, 2026',
    total: '$129.99',
    status: 'Pending',
    statusStyle: 'text-amber-800',
  },
  {
    id: 1042,
    date: 'November 3, 2026',
    total: '$84.50',
    status: 'Shipped',
    statusStyle: 'text-sky-700',
  },
  {
    id: 1036,
    date: 'October 28, 2026',
    total: '$56.00',
    status: 'Delivered',
    statusStyle: 'text-green-700',
  },
  {
    id: 1029,
    date: 'October 22, 2026',
    total: '$39.99',
    status: 'Cancelled',
    statusStyle: 'text-gray-600',
  },
];

export default function OrdersPage() {
  return (
    <div className="text-dark mx-auto my-4 w-11/12 max-w-6xl bg-white px-4 py-5 md:px-8 md:py-6">
      <h1 className="mb-6 text-2xl md:text-3xl">Your Orders</h1>

      <div
        className="hidden grid-cols-[minmax(0,1fr)_8rem_7rem_9rem] gap-6 px-3 pb-3 text-sm text-gray-500 md:grid"
        aria-hidden="true"
      >
        <span>Order</span>
        <span>Status</span>
        <span className="text-right">Total</span>
        <span />
      </div>

      <ul className="divide-y divide-gray-200 border-y border-gray-200">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/orders/${order.id}`}
              className="group focus-visible:outline-dark_blue grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-3 py-5 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 md:grid-cols-[minmax(0,1fr)_8rem_7rem_9rem] md:gap-6 md:py-6"
            >
              <div>
                <h2 className="font-semibold">Order #{order.id}</h2>
                <p className="mt-1 text-sm text-gray-500">{order.date}</p>
              </div>

              <p className={`text-right text-sm font-medium md:text-left ${order.statusStyle}`}>
                <span className="sr-only">Status: </span>
                {order.status}
              </p>

              <p className="text-sm font-medium tabular-nums md:text-right md:text-base">
                <span className="mr-1 font-normal text-gray-500 md:sr-only">Total:</span>
                {order.total}
              </p>

              <span className="text-right text-sm text-sky-700 underline-offset-4 group-hover:underline">
                View order details
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
