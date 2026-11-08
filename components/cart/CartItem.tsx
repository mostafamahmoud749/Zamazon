'use client';
import Image from 'next/image';
import type { CartProduct } from '@/types/index';
import Counter from '@/components/common/Counter';
import Link from 'next/link';
import { getUnitPriceCents } from '@/lib/pricing';
import Price from '@/components/common/Price';

type CartItemProps = {
  product: CartProduct;
};

export default function CartItem({ product }: CartItemProps) {
  return (
    <div className="my-2 flex gap-4 rounded-b-sm px-2 pt-1">
      <Link href={`/deals/${product.product.id}`}>
        <Image
          className="object-fit max-h-[135px] min-w-[145px]"
          width={145}
          height={135}
          src={product.product.image}
          alt="product image"
        ></Image>
      </Link>
      <div className="min-w-0 flex-1">
        <div className="md:flex md:gap-10">
          <div className="line-clamp-2 overflow-hidden font-light md:min-w-0 md:flex-1 md:text-lg md:font-medium">
            {product.product.description}
          </div>
          <Price
            priceCents={getUnitPriceCents(product.product)}
            originalPriceCents={Math.round(Number(product.product.price) * 100)}
            className="text-xl md:ml-auto md:shrink-0 md:text-right"
          />
        </div>
        <Counter product={product} />
      </div>
    </div>
  );
}
