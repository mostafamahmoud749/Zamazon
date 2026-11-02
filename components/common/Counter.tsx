'use client';
import type { CartProduct } from '@/types/index';
import { CartContext } from '@/components/cart/CartProvider';
import { UserContext } from '@/components/auth/UserProvider';
import { useContext, useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

type CounterProps = {
  product: CartProduct;
};

export default function Counter({ product }: CounterProps) {
  const { removeFromCart, updateCartItemQuantity } = useContext(CartContext);
  const { status } = useContext(UserContext);
  const [quantity, setQuantity] = useState(product.quantity);
  const debouncedQuantity = useDebounce(quantity, 500);

  function handleIncrease() {
    setQuantity((q) => Math.min(q + 1, product.product.stock));
  }

  function handleDecrease() {
    setQuantity((q) => Math.max(0, q - 1));
  }

  const id = status === 'authenticated' ? product.id : product.product.id;

  useEffect(() => {
    if (status === 'loading' || id === undefined) return;
    if (quantity !== debouncedQuantity) return;

    if (debouncedQuantity === product.quantity) return;

    if (debouncedQuantity === 0) {
      void removeFromCart(id);
    } else {
      void updateCartItemQuantity(id, debouncedQuantity);
    }
  }, [
    quantity,
    debouncedQuantity,
    product.quantity,
    id,
    status,
    removeFromCart,
    updateCartItemQuantity,
  ]);

  return (
    <div className="flex max-h-8 w-full max-w-30 items-center justify-between gap-2 rounded-3xl border-3 border-amber-300 px-2 text-xs font-bold md:mt-2">
      <button className="cursor-pointer text-xl" onClick={handleDecrease}>
        {' '}
        -{' '}
      </button>
      <div>{quantity}</div>
      <button
        className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-50"
        onClick={handleIncrease}
        disabled={quantity >= product.product.stock}
      >
        +
      </button>
    </div>
  );
}
