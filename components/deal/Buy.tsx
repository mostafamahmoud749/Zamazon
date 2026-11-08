'use client';
import Button from '@/components/common/Button';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import type { Product } from '@/types/index';
import { formatPrice, getUnitPriceCents } from '@/lib/pricing';

type BuyProps = {
  product: Product;
};
export default function Buy({ product }: BuyProps) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="mt-4">
      <div className="mb-2 text-3xl font-bold">{formatPrice(getUnitPriceCents(product) / 100)}</div>

      <div className="my-4">
        <Button
          className="my-2 w-full cursor-pointer rounded-3xl bg-yellow-400 py-2 text-center transition-all duration-200 enabled:hover:bg-amber-400 enabled:hover:shadow-md"
          onClick={() => addToCart(product, 1)}
          loadingText="Adding..."
        >
          Add to Cart
        </Button>
      </div>

      <div className="border-t border-gray-300 pt-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Product Details</h2>
        <div className="text-sm text-gray-600">{product.description}</div>
      </div>
    </div>
  );
}
