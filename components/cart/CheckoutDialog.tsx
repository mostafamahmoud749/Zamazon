'use client';
import Button from '@/components/common/Button';
import { Banknote, CreditCard, ShoppingBag, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import Input from '@/components/common/Input';

type CheckoutDialogProps = {
  totalProductsCount: number;
  totalProductsPrice: number;
  onClose: () => void;
  paymentMethod: 'card' | 'cash';
  onPaymentMethodChange: (value: 'card' | 'cash') => void;
  paymentMethodLocked: boolean;
  isSubmitting: boolean;
  onSubmit: () => Promise<void>;
  notification: ReactNode;
};

export default function CheckoutDialog({
  totalProductsCount,
  totalProductsPrice,
  onClose,
  paymentMethod,
  onPaymentMethodChange,
  paymentMethodLocked,
  isSubmitting,
  onSubmit,
  notification,
}: CheckoutDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selectedCard, setSelectedCard] = useState<'example' | 'new'>('example');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';

    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClose={(event) => {
        if (!event.currentTarget.open) onClose();
      }}
      onCancel={(event) => {
        if (isSubmitting) event.preventDefault();
      }}
      onClick={(event) => {
        if (!isSubmitting && event.target === event.currentTarget) onClose();
      }}
      className="text-dark m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      {notification}
      <div className="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-5 sm:px-7">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-widest text-gray-500 uppercase">
            Checkout
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Choose how to pay</h2>
          <p className="mt-2 text-sm text-gray-600">Select a payment method for your order.</p>
        </div>
        <Button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="focus-visible:outline-dark_blue flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <X size={20} aria-hidden="true" />
        </Button>
      </div>

      <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[minmax(0,1fr)_220px]">
        <div>
          <fieldset disabled={isSubmitting || paymentMethodLocked}>
            <legend className="mb-3 text-sm font-semibold">Payment method</legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  {
                    value: 'card',
                    label: 'Card',
                    description: 'Credit or debit card',
                    Icon: CreditCard,
                  },
                  {
                    value: 'cash',
                    label: 'Cash on delivery',
                    description: 'Pay by hand',
                    Icon: Banknote,
                  },
                ] as const
              ).map(({ value, label, description, Icon }) => (
                <label
                  key={value}
                  className={`flex cursor-pointer flex-col items-start gap-3 rounded-xl border p-4 transition-colors ${
                    paymentMethod === value
                      ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-400'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <Icon size={23} aria-hidden="true" className="text-dark_blue" />
                    <input
                      type="radio"
                      name="checkout-payment-method"
                      value={value}
                      checked={paymentMethod === value}
                      onChange={() => onPaymentMethodChange(value)}
                      className="size-4 accent-amber-500"
                    />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{label}</span>
                    <span className="mt-1 block text-xs text-gray-500">{description}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {paymentMethodLocked && !isSubmitting && (
            <p className="mt-3 text-sm text-gray-600">
              Retry with the same payment method to confirm your previous attempt.
            </p>
          )}

          {paymentMethod === 'card' ? (
            <fieldset className="mt-6">
              <legend className="mb-3 text-sm font-semibold">Choose a card</legend>
              <div className="overflow-hidden rounded-xl border border-gray-200">
                <label className="flex cursor-pointer items-center gap-3 p-4 hover:bg-gray-50">
                  <input
                    type="radio"
                    name="checkout-card"
                    checked={selectedCard === 'example'}
                    onChange={() => setSelectedCard('example')}
                    className="size-4 shrink-0 accent-amber-500"
                  />
                  <span className="rounded border border-gray-200 bg-white px-2 py-1 text-xs font-bold text-blue-900 italic">
                    VISA
                  </span>
                  <span>
                    <span className="block text-sm font-medium">Visa ending in 4242</span>
                    <span className="mt-1 block text-xs text-gray-500">
                      Sample card · Expires 12/2028
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3 border-t border-gray-200 p-4 text-sm hover:bg-gray-50">
                  <input
                    type="radio"
                    name="checkout-card"
                    checked={selectedCard === 'new'}
                    onChange={() => setSelectedCard('new')}
                    className="size-4 accent-amber-500"
                  />
                  Use another card
                </label>
              </div>
              {selectedCard === 'new' && (
                <div className="mt-4 space-y-4 rounded-xl bg-gray-50 p-4">
                  <Input
                    label="Name on card"
                    name="checkout-card-name"
                    placeholder="Full name"
                    autoComplete="cc-name"
                  />
                  <Input
                    label="Card number"
                    name="checkout-card-number"
                    placeholder="1234 5678 9012 3456"
                    inputMode="numeric"
                    autoComplete="cc-number"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry date"
                      name="checkout-card-expiry"
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                    <Input
                      label="Security code"
                      name="checkout-card-cvc"
                      type="password"
                      placeholder="CVC"
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </div>
                </div>
              )}
            </fieldset>
          ) : (
            <div className="mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <h3 className="text-sm font-semibold">Pay when your order arrives</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Hand the payment to the courier on delivery. No card needed.
              </p>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-gray-200 bg-gray-50 p-5">
          <h3 className="flex items-center gap-2 font-semibold">
            <ShoppingBag size={18} aria-hidden="true" />
            Order summary
          </h3>
          <dl className="mt-5 text-sm">
            <div className="flex justify-between gap-3 text-gray-600">
              <dt>Items ({totalProductsCount})</dt>
              <dd>{totalProductsPrice.toFixed(2)}$</dd>
            </div>
            <div className="mt-4 flex justify-between gap-3 border-t border-gray-200 pt-4 text-base font-semibold">
              <dt>Subtotal</dt>
              <dd>{totalProductsPrice.toFixed(2)}$</dd>
            </div>
          </dl>

          <Button
            type="button"
            onClick={onSubmit}
            loading={isSubmitting}
            loadingText="Placing your order..."
            className="bg-yellow focus-visible:outline-dark_blue mt-5 w-full cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Place your order
          </Button>
        </aside>
      </div>

      <div className="border-t border-gray-200 px-5 py-4 sm:px-7">
        <Button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="focus-visible:outline-dark_blue cursor-pointer rounded text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Back to cart
        </Button>
      </div>
    </dialog>
  );
}
