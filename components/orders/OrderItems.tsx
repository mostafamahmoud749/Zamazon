import OrderItem from '@/components/orders/OrderItem';
import type { OrderItem as OrderItemData } from '@/types/orders';

export default function OrderItems({ items }: { items: OrderItemData[] }) {
  const quantity = items.reduce((total, item) => total + item.quantity, 0);
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 id="items-heading" className="font-semibold">
          Items in your order
        </h2>
        <span className="text-sm text-gray-500">
          {quantity} {quantity === 1 ? 'item' : 'items'}
        </span>
      </div>
      <ul className="divide-y divide-gray-100 px-5 sm:px-6">
        {items.map((item) => (
          <OrderItem key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
