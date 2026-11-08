'use client';

import Button from '@/components/common/Button';
import CheckoutDialog from '@/components/cart/CheckoutDialog';
import Popup from '@/components/common/Popup';
import { UserContext } from '@/components/auth/UserProvider';
import { CreateOrderSchema } from '@/schemas/Orders.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';
import { formatPrice } from '@/lib/pricing';
import { useContext, useEffect, useState } from 'react';

type CartList = {
  totalProductsCount: number;
  totalProductsPrice: number;
};

type CheckoutAttempt = {
  key: string;
  data: { addressId: number; paymentMethod: 'card' | 'cash' };
};

export default function CartList({ totalProductsCount, totalProductsPrice }: CartList) {
  const { user } = useContext(UserContext);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [checkoutAttempt, setCheckoutAttempt] = useState<CheckoutAttempt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popup, setPopup] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!popup) return;
    const timeout = setTimeout(() => setPopup(null), 8000);
    return () => clearTimeout(timeout);
  }, [popup]);

  async function handleSubmit() {
    if (isSubmitting) return;
    setPopup(null);

    if (!user) {
      setPopup({ success: false, message: 'Please sign in to place your order.' });
      return;
    }

    const result = CreateOrderSchema.safeParse(
      checkoutAttempt?.data ?? { addressId: user.defaultAddressId, paymentMethod },
    );

    if (!result.success) {
      setPopup({ success: false, message: 'Please select a valid default shipping address.' });
      return;
    }

    const attempt = checkoutAttempt ?? { key: crypto.randomUUID(), data: result.data };
    setCheckoutAttempt(attempt);
    setIsSubmitting(true);

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
          'Idempotency-Key': attempt.key,
        },
        body: JSON.stringify(attempt.data),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status < 500 && response.status !== 408) setCheckoutAttempt(null);
        throw new Error(responseData?.error || 'Could not place your order. Please try again.');
      }

      setCheckoutAttempt(null);
      window.location.assign('/orders');
    } catch (error) {
      setPopup({
        success: false,
        message:
          error instanceof Error ? error.message : 'Could not place your order. Please try again.',
      });
      setIsSubmitting(false);
    }
  }

  const notification = popup && (
    <Popup success={popup.success} message={popup.message} onClose={() => setPopup(null)} />
  );

  return (
    <div className="px-3 md:flex md:flex-row-reverse md:justify-between">
      {!isCheckoutOpen && notification}
      <div className="flex items-center gap-2 border-b-1 border-b-amber-100 md:my-2 md:justify-end md:border-none">
        <div className="text-xl font-medium">Subtotal ({totalProductsCount} items): </div>
        <div className="text-2xl font-semibold">{formatPrice(totalProductsPrice)}</div>
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
          paymentMethod={checkoutAttempt?.data.paymentMethod ?? paymentMethod}
          onPaymentMethodChange={setPaymentMethod}
          paymentMethodLocked={checkoutAttempt !== null}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          notification={notification}
        />
      )}
    </div>
  );
}
