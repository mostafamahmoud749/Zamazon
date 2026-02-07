'use client';
import { useContext, useMemo } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import CartSidebarItem from '@/components/cart/CartSidebarItem';
import Button from '@/components/common/Button';
import Link from 'next/link';
import Image from 'next/image';
import Counter from '@/components/cart/Counter';
import type { CartProduct } from '@/types/index';
import {JSX} from "react"

export default function CartSidebar() {
  const { products, totalProductsPrice, addToCart, removeFromCart } = useContext(CartContext);
  const showItems:JSX.Element[] = useMemo(() => {
    return products.map((el:CartProduct):JSX.Element => (
      <CartSidebarItem key={el.id}>
        <div className="flex w-full flex-col items-center hover:bg-gray-100">
          <Link href={`/deals/${el.id}`} className="flex w-full justify-center">
            <Image
              src={el.image}
              alt="Products img"
              width={110}
              height={110}
              className="object-contain pt-4"
            />
          </Link>
          <div className="mt-2 mb-1 text-sm font-bold">{el.price}$</div>
        </div>
        <Counter product={el} addToCart={addToCart} removeFromCart={removeFromCart} />
        <div className="mb-1"></div>
      </CartSidebarItem>
    ));
  }, [products, addToCart, removeFromCart]);

  return (
    <div className={`relative min-w-[130px] border-l-1 border-l-gray-300 bg-white ${products.length>0?"hidden lg:block":"hidden"}`}>
      <div className="fixed w-[130px]">
        <CartSidebarItem>
          <div className="text-xs">Subtotal</div>
          <div className="text-xs font-bold text-rose-700">{totalProductsPrice.toFixed(2)}$</div>
          <Link href="/cart" className="w-full">
            <Button
              extraStyling="border-1 text-xs border-gray-500"
              hoverdColor="hover:bg-gray-100"
              padding="p-[2px]"
            >
              Go to basket
            </Button>
          </Link>
        </CartSidebarItem>
        {showItems}
      </div>
    </div>
  );
}
