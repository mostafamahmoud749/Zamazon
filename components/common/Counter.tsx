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
  const [pendingQuantity, setPendingQuantity] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const quantity = pendingQuantity ?? product.quantity;
  const debouncedQuantity = useDebounce(pendingQuantity, 500);

  function handleIncrease() {
    setPendingQuantity((q) => Math.min((q ?? product.quantity) + 1, product.product.stock));
  }

  function handleDecrease() {
    setPendingQuantity((q) => Math.max(0, (q ?? product.quantity) - 1));
  }

  const id = status === 'authenticated' ? product.id : product.product.id;

  useEffect(() => {
    if (status !== 'authenticated' && status !== 'unauthenticated') return;
    if (id === undefined || isUpdating || pendingQuantity === null) return;
    if (pendingQuantity !== debouncedQuantity || debouncedQuantity === null) return;

    if (debouncedQuantity === product.quantity) {
      setPendingQuantity(null);
      return;
    }

    setIsUpdating(true);
    const update =
      debouncedQuantity === 0 ? removeFromCart(id) : updateCartItemQuantity(id, debouncedQuantity);

    void update.finally(() => {
      setPendingQuantity((current) => (current === debouncedQuantity ? null : current));
      setIsUpdating(false);
    });
  }, [
    pendingQuantity,
    debouncedQuantity,
    isUpdating,
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
