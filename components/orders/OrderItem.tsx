import Image from 'next/image';
import type { OrderItem as OrderItemData } from '@/types/orders';

export default function OrderItem({ item }: { item: OrderItemData }) {
  return (
    <li className="flex items-start gap-4 py-6 sm:gap-5">
      <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:size-24">
        <Image
          src={item.product.image}
          alt={item.product.title}
          width={96}
          height={96}
          className="size-full object-contain p-2"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-wrap justify-between gap-x-4 gap-y-2 pt-1">
        <div>
          <h3 className="text-sm font-medium sm:text-base">{item.product.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
            {item.product.description}
          </p>
          <p className="mt-3 text-xs text-gray-500">
            Quantity: <span className="text-gray-900">{item.quantity}</span>
          </p>
        </div>
        <p className="text-sm font-semibold tabular-nums sm:text-base">
          ${((Math.round(Number(item.price) * 100) * item.quantity) / 100).toFixed(2)}
        </p>
      </div>
    </li>
  );
}
