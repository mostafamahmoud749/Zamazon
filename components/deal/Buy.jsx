'use client';
import Button from '@/components/common/Button';
import { useContext, useState } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

export default function Buy({ product }) {
  const { addToCart } = useContext(CartContext);

  const [addState, setAddState] = useState('idle');
  const [buyState, setBuyState] = useState('idle');

  async function handleAddToCart() {
    if (addState !== 'idle') return;
    setAddState('loading');
    addToCart(product);
    window.setTimeout(() => setAddState('idle'), 300);
  }

  async function handleBuyNow() {
    if (buyState !== 'idle') return;
    setBuyState('loading');
    window.setTimeout(() => setBuyState('idle'), 300);
  }

  return (
    <div className="mt-4">
      <div className="mb-2 text-3xl font-bold">{product.price}$</div>

      <div className="my-4">
        <Button
          color="bg-yellow-400"
          hoverdColor="hover:bg-amber-400 hover:shadow-md"
          disabled={addState !== 'idle'}
          onClick={handleAddToCart}
          padding="py-2"
        >
          Add to Cart
        </Button>

        <Button
          color="bg-orange-500"
          hoverdColor="hover:bg-orange-600 hover:shadow-md"
          disabled={buyState !== 'idle'}
          onClick={handleBuyNow}
          padding="py-2"
        >
          Buy Now
        </Button>
      </div>

      <div className="border-t border-gray-300 pt-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Product Details</h2>
        <div className="text-sm text-gray-600">{product.description}</div>
      </div>
    </div>
  );
}
