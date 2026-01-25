'use client';
import EmptyCart from '@/components/cart/EmptyCart';
import FilledCart from '@/components/cart/FilledCart';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

export default function CartState() {
  const { products } = useContext(CartContext);
    return (
    <>
      {products.length>0?<FilledCart />:<EmptyCart />}  
    </>
  );
}
