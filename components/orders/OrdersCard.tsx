import Link from 'next/link';

type OrdersCardProps = {
  id: number;
  status: string;
  date: string;
  total: number;
};

export default function OrdersCard({ id, date, status, total }: OrdersCardProps) {
  const statusStyle =
    status === 'CANCELED'
      ? 'text-gray-500'
      : status === 'PENDING'
        ? 'text-sky-700'
        : 'text-gray-600';
  return (
    <li key={id}>
      <Link
        href={`/orders/${id}`}
        className="group focus-visible:outline-dark_blue grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-3 py-5 transition-colors hover:bg-gray-50 focus-visible:outline-2 focus-visible:-outline-offset-2 md:grid-cols-[minmax(0,1fr)_8rem_7rem_9rem] md:gap-6 md:py-6"
      >
        <div>
          <h2 className="font-semibold">Order #{id}</h2>
          <p className="mt-1 text-sm text-gray-500">{date}</p>
        </div>

        <p className={`text-right text-sm font-medium md:text-left ${statusStyle}`}>
          <span className="sr-only">Status: </span>
          {status}
        </p>

        <p className="text-sm font-medium tabular-nums md:text-right md:text-base">
          <span className="mr-1 font-normal text-gray-500 md:sr-only">Total:</span>
          {`$${total.toFixed(2)}`}
        </p>

        <span className="text-right text-sm text-sky-700 underline-offset-4 group-hover:underline">
          View order details
        </span>
      </Link>
    </li>
  );
}
