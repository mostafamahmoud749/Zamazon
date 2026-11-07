'use client';

import Button from '@/components/common/Button';
import CheckoutDialog from '@/components/cart/CheckoutDialog';
import { useState } from 'react';

type CartList = {
  totalProductsCount: number;
  totalProductsPrice: number;
};

export default function CartList({ totalProductsCount, totalProductsPrice }: CartList) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <div className="px-3 md:flex md:flex-row-reverse md:justify-between">
      <div className="flex items-center gap-2 border-b-1 border-b-amber-100 md:my-2 md:justify-end md:border-none">
        <div className="text-xl font-medium">Subtotal ({totalProductsCount} items): </div>
        <div className="text-2xl font-semibold">{totalProductsPrice.toFixed(2)}$</div>
      </div>
      <Button
        className="my-4 w-full cursor-pointer rounded-3xl bg-amber-300 py-2 text-center transition-all duration-200 enabled:hover:bg-amber-400 md:my-3 md:max-w-fit md:px-3"
        onClick={() => setIsCheckoutOpen(true)}
      >
        Proceed to checkout
      </Button>
      {isCheckoutOpen && (
        <CheckoutDialog
          totalProductsCount={totalProductsCount}
          totalProductsPrice={totalProductsPrice}
          onClose={() => setIsCheckoutOpen(false)}
        />
      )}
    </div>
  );
}
