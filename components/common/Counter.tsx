'use client';
import type { CartProduct } from '@/types/index';
import { CartContext } from '@/components/cart/CartProvider';
import { UserContext } from '@/components/auth/UserProvider';
import { useContext } from 'react';

type CounterProps = {
  product: CartProduct;
};

export default function Counter({ product }: CounterProps) {
  const { addToCart, removeFromCart, updateCartItemQuantity } = useContext(CartContext);
  const { status } = useContext(UserContext);

  async function handleDecrease() {
    const id = status === 'authenticated' ? product.id : product.product.id;

    if (id === undefined) return;

    if (product.quantity > 1) {
      await updateCartItemQuantity(id, product.quantity - 1);
    } else {
      await removeFromCart(id);
    }
  }

  return (
    <div className="flex max-h-8 w-full max-w-30 items-center justify-between gap-2 rounded-3xl border-3 border-amber-300 px-2 text-xs font-bold md:mt-2">
      <button className="cursor-pointer text-xl" onClick={handleDecrease}>
        {' '}
        -{' '}
      </button>
      <div>{product.quantity}</div>
      <button className="cursor-pointer text-xl" onClick={() => addToCart(product.product, 1)}>
        +
      </button>
    </div>
  );
}
