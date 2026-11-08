'use client';
import { useContext, useMemo } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import CartSidebarItem from '@/components/cart/CartSidebarItem';
import Button from '@/components/common/Button';
import Link from 'next/link';
import Image from 'next/image';
import Counter from '@/components/common/Counter';
import type { CartProduct } from '@/types/index';
import { JSX } from 'react';
import { formatPrice, getUnitPriceCents } from '@/lib/pricing';

export default function CartSidebar() {
  const { products, totalProductsPrice } = useContext(CartContext);
  const showItems: JSX.Element[] = useMemo(() => {
    return products.map((product: CartProduct): JSX.Element => (
      <CartSidebarItem key={product.product.id}>
        <div className="flex w-full flex-col items-center hover:bg-gray-100">
          <Link href={`/deals/${product.product.id}`} className="flex w-full justify-center">
            <Image
              src={product.product.image}
              alt="Products img"
              width={110}
              height={110}
              className="object-contain pt-4"
            />
          </Link>
          <div className="mt-2 mb-1 text-sm font-bold">
            {formatPrice(getUnitPriceCents(product.product) / 100)}
          </div>
        </div>
        <Counter product={product} />
        <div className="mb-1"></div>
      </CartSidebarItem>
    ));
  }, [products]);

  return (
    <div
      className={`relative min-w-[130px] border-l-1 border-l-gray-300 bg-white ${products.length > 0 ? 'hidden lg:block' : 'hidden'}`}
    >
      <div className="fixed w-[130px]">
        <CartSidebarItem>
          <div className="text-xs">Subtotal</div>
          <div className="text-xs font-bold text-rose-700">{formatPrice(totalProductsPrice)}</div>
          <Link href="/cart" className="w-full">
            <Button className="my-2 w-full cursor-pointer rounded-3xl border-1 border-gray-500 p-[2px] text-center text-xs transition-all duration-200 enabled:hover:bg-gray-100">
              Go to basket
            </Button>
          </Link>
        </CartSidebarItem>
        {showItems}
      </div>
    </div>
  );
}
