'use client';
import EmptyCart from '@/components/cart/EmptyCart';
import FilledCart from '@/components/cart/FilledCart';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import {JSX} from "react"

export default function CartState():JSX.Element {
  const { products } = useContext(CartContext);
    return (
    <>
      {products.length>0?<FilledCart />:<EmptyCart />}  
    </>
  );
}
