'use client';
import Button from '@/components/common/Button';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import type { Product } from '@/types/index';
import Counter from '@/components/common/Counter';
import Stars from '@/components/deal/Stars';
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
      <div className="mt-1 flex min-h-5 flex-wrap items-center gap-x-1">
        {el.rating.count > 0 && <Stars value={el.rating.rate} />}
        <span
          className="text-xs text-sky-700"
          aria-label={`${el.rating.count} ${el.rating.count === 1 ? 'review' : 'reviews'}`}
        >
          {el.rating.count > 0 ? `(${el.rating.count})` : 'No reviews yet'}
        </span>
      </div>
      <div className="-ml-1 max-w-[100px]">
        {el.stock <= 0 ? (
          <p className="my-2 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium whitespace-nowrap text-gray-600">
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-gray-400" />
            Out of stock
          </p>
        ) : product ? (
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
