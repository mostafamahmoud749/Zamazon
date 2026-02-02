"use client"
import Image from 'next/image';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

export default function CartItem({ product }) {
  const {addToCart,removeFromCart}=useContext(CartContext)
  return (
    <div className="my-2 flex gap-4 rounded-b-sm px-2 pt-1">
      <Image
        className="object-fit max-h-[135px] min-w-[145px]"
        width={145}
        height={135}
        src={product.image}
        alt="product image"
      ></Image>
      <div>
        <div className="md:flex md:gap-5">
          <div className="line-clamp-2 overflow-hidden font-light md:text-lg md:font-medium">
            {product.description}
          </div>
          <div className="text-xl font-semibold">{product.price}$</div>
        </div>
        <div className="flex max-h-8 max-w-30 items-center justify-between gap-2 rounded-3xl border-3 border-amber-300 px-2 md:mt-2">
          <button className="cursor-pointer text-xl" onClick={()=>removeFromCart(product)}> - </button>
          <div>{product.count}</div>
          <button className="cursor-pointer text-xl" onClick={()=>addToCart(product)}>+</button>
        </div>
      </div>
    </div>
  );
}
