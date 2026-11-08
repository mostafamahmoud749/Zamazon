'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Banknote, Check, ChevronLeft, MapPin, Package, PackageX } from 'lucide-react';
import { useState } from 'react';
import Button from '@/components/common/Button';
import { getCsrfToken } from '@/lib/getCsrfToken';

const sampleItems = [
  {
    name: 'Noise Cancelling Headphones',
    description: 'Wireless over-ear headphones · Black',
    image: '/products/studio/noise-cancelling-headphones.webp',
    price: '$129.99',
  },
  {
    name: 'Mechanical Keyboard',
    description: 'Compact wireless keyboard · Ivory',
    image: '/products/studio/mechanical-keyboard.webp',
    price: '$89.50',
  },
];

export default function OrderDetails({ orderId }: { orderId: number }) {
  const [isCanceled, setIsCanceled] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState('');

  async function cancelOrder() {
    if (isCanceling || isCanceled) return;
    setIsCanceling(true);
    setError('');

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'X-CSRF-Token': csrfToken },
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error('Please sign in to cancel your order.');
        if (response.status === 404) throw new Error('This order could not be found.');
        if (response.status === 400) {
          throw new Error('This order is no longer pending and cannot be canceled.');
        }
        throw new Error('Could not cancel your order. Please try again.');
      }

      setIsCanceled(true);
      setIsConfirming(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not cancel your order.');
    } finally {
      setIsCanceling(false);
    }
  }

  return (
    <div className="text-dark mx-auto my-6 w-11/12 max-w-6xl md:my-8">
      <Link
        href="/orders"
        className="focus-visible:outline-dark_blue inline-flex items-center gap-1 text-sm text-sky-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        <ChevronLeft size={16} aria-hidden="true" />
        Your orders
      </Link>

      <header className="mt-5 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Order details</h1>
          <p className="mt-2 text-sm text-gray-600">
            Order <span className="font-medium text-gray-900">#{orderId}</span>
            <span className="mx-2 text-gray-300" aria-hidden="true">
              |
            </span>
            Placed on November 6, 2026
          </p>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <div className="min-w-0 space-y-5">
          <section
            aria-labelledby="order-status-heading"
            className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6"
          >
            <div className="flex items-start gap-4" role="status">
              <div
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${isCanceled ? 'bg-gray-100 text-gray-500' : 'bg-amber-50 text-amber-700'}`}
              >
                {isCanceled ? (
                  <PackageX size={23} aria-hidden="true" />
                ) : (
                  <Package size={23} aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="order-status-heading" className="text-lg font-semibold">
                  {isCanceled ? 'Order canceled' : 'Order placed'}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  {isCanceled ? 'This order has been canceled.' : 'Your order has been received.'}
                </p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="items-heading"
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <h2 id="items-heading" className="font-semibold">
                Items in your order
              </h2>
              <span className="text-sm text-gray-500">2 items</span>
            </div>
            <ul className="divide-y divide-gray-100 px-5 sm:px-6">
              {sampleItems.map((item) => (
                <li key={item.name} className="flex items-start gap-4 py-6 sm:gap-5">
                  <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50 sm:size-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="size-full object-contain p-2"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-wrap justify-between gap-x-4 gap-y-2 pt-1">
                    <div>
                      <h3 className="text-sm font-medium sm:text-base">{item.name}</h3>
                      <p className="mt-1 text-xs leading-relaxed text-gray-500 sm:text-sm">
                        {item.description}
                      </p>
                      <p className="mt-3 text-xs text-gray-500">
                        Quantity: <span className="text-gray-900">1</span>
                      </p>
                    </div>
                    <p className="text-sm font-semibold tabular-nums sm:text-base">{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Shipping and payment"
            className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2"
          >
            <div className="p-5 sm:p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <MapPin size={17} className="text-gray-500" aria-hidden="true" />
                Shipping address
              </h2>
              <address className="mt-4 space-y-1 text-sm leading-relaxed text-gray-600 not-italic">
                <p className="font-medium text-gray-900">Mostafa Ahmed</p>
                <p>24 El Tahrir Street</p>
                <p>Dokki, Giza 12611</p>
                <p>Egypt</p>
              </address>
            </div>
            <div className="border-t border-gray-100 p-5 sm:border-t-0 sm:border-l sm:p-6">
              <h2 className="flex items-center gap-2 text-sm font-semibold">
                <Banknote size={17} className="text-gray-500" aria-hidden="true" />
                Payment method
              </h2>
              <p className="mt-4 text-sm font-medium">Cash on delivery</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Payment is collected when your order arrives.
              </p>
            </div>
          </section>
        </div>

        <aside className="overflow-hidden rounded-2xl border border-gray-200 bg-white lg:sticky lg:top-6">
          <div className="p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-gray-600">
                <dt>Items subtotal</dt>
                <dd className="tabular-nums">$219.49</dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-base font-semibold">
                <dt>Order total</dt>
                <dd className="tabular-nums">$219.49</dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-gray-500">All prices are in USD.</p>
          </div>
          <div className="border-t border-gray-100 bg-gray-50 px-5 py-5 sm:px-6">
            {isCanceled ? (
              <p className="flex items-center gap-2 text-sm text-gray-600">
                <Check size={16} aria-hidden="true" />
                Order canceled
              </p>
            ) : (
              <>
                <h3 className="text-sm font-medium">
                  {isConfirming ? 'Cancel this order?' : 'Changed your mind?'}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">
                  {isConfirming
                    ? 'Confirm that you want to cancel this order.'
                    : 'You can cancel your order while its status is pending.'}
                </p>
                {error && (
                  <p role="alert" className="mt-3 text-sm text-red-700">
                    {error}
                  </p>
                )}
                {isConfirming ? (
                  <div className="mt-4 space-y-2">
                    <Button
                      onClick={cancelOrder}
                      loading={isCanceling}
                      loadingText="Canceling order…"
                      className="focus-visible:outline-dark_blue w-full cursor-pointer rounded-full bg-red-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-800 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      Confirm cancellation
                    </Button>
                    <Button
                      onClick={() => {
                        setIsConfirming(false);
                        setError('');
                      }}
                      disabled={isCanceling}
                      className="focus-visible:outline-dark_blue w-full cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                    >
                      Keep my order
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsConfirming(true)}
                    className="focus-visible:outline-dark_blue mt-4 w-full cursor-pointer rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    Cancel order
                  </Button>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
