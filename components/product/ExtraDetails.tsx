'use client';
import Button from '@/components/common/Button';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import type { Product } from '@/types/index';
import Counter from '@/components/common/Counter';
import { formatPrice, getUnitPriceCents } from '@/lib/pricing';

type ExtraDetailsProps = {
  el: Product;
};

export default function ExtraDetails({ el }: ExtraDetailsProps) {
  const { addToCart, products } = useContext(CartContext);
  const product = products.find((item) => item.product.id === el.id);

  return (
    <div className="mx-1 my-2">
      <div>{formatPrice(getUnitPriceCents(el) / 100)}</div>
      <p className="line-clamp-2 text-sm font-medium text-gray-700">{el.title}</p>
      <div className="-ml-1 max-w-[100px]">
        {product ? (
          <Counter product={product} />
        ) : (
          <Button
            className="my-2 w-full cursor-pointer rounded-3xl bg-yellow-400 py-1 text-center transition-all duration-200 enabled:hover:bg-amber-400"
            onClick={() => addToCart(el, 1)}
            loadingText="Adding..."
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
