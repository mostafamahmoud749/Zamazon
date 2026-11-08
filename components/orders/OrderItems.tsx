import OrderItem from '@/components/orders/OrderItem';

const sampleItems = [
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones · Black',
    image: '/products/studio/noise-cancelling-headphones.webp',
    price: '$129.99',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Compact wireless keyboard · Ivory',
    image: '/products/studio/mechanical-keyboard.webp',
    price: '$89.50',
  },
];

export default function OrderItems() {
  return (
    <section
      aria-labelledby="items-heading"
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
    >
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
        <h2 id="items-heading" className="font-semibold">
          Items in your order
        </h2>
        <span className="text-sm text-gray-500">2 items</span>
      </div>
      <ul className="divide-y divide-gray-100 px-5 sm:px-6">
        {sampleItems.map((item) => (
          <OrderItem key={item.name} {...item} />
        ))}
      </ul>
    </section>
  );
}
