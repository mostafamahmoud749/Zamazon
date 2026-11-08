'use client';
import EmptyCart from '@/components/cart/EmptyCart';
import FilledCart from '@/components/cart/FilledCart';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import CartSkeleton from '@/components/loading/CartSkeleton';

export default function CartState() {
  const { products, isLoading } = useContext(CartContext);
  if (isLoading) return <CartSkeleton />;
  return <>{products.length > 0 ? <FilledCart /> : <EmptyCart />}</>;
}
