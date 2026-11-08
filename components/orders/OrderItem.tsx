'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { OrderItem as OrderItemData } from '@/types/orders';
import Price from '@/components/common/Price';
import { fetchProduct } from '@/lib/fetchProducts';
import { getUnitPriceCents } from '@/lib/pricing';

export default function OrderItem({ item }: { item: OrderItemData }) {
  const unitPriceCents = Math.round(Number(item.price) * 100);
  const [originalUnitPriceCents, setOriginalUnitPriceCents] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setOriginalUnitPriceCents(null);

    async function loadProductPrice() {
      try {
        const product = await fetchProduct(`/api/products/${item.product.id}`, controller.signal);
        if (controller.signal.aborted) return;

        // Only show savings when current product pricing matches the price actually paid.
        if (
          product &&
          Number(product.discount) > 0 &&
          getUnitPriceCents(product) === unitPriceCents
        ) {
          setOriginalUnitPriceCents(Math.round(Number(product.price) * 100));
        }
      } catch {
        // Product pricing is optional; the saved order price is always displayed.
      }
    }

    void loadProductPrice();
    return () => controller.abort();
  }, [item.product.id, unitPriceCents]);

  return (
    <li className="flex items-start gap-4 py-6 sm:gap-5">
      <Link
        href={`/deals/${item.product.id}`}
        className="flex size-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:size-24"
      >
        <Image
          src={item.product.image}
          alt={item.product.title}
          width={96}
          height={96}
          className="size-full object-contain p-2"
        />
      </Link>
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
        <Price
          priceCents={unitPriceCents * item.quantity}
          originalPriceCents={
            originalUnitPriceCents == null ? null : originalUnitPriceCents * item.quantity
          }
          className="text-sm sm:text-right sm:text-base"
        />
      </div>
    </li>
  );
}
