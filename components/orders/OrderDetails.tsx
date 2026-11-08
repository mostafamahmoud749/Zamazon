'use client';

import { useState } from 'react';
import { getCsrfToken } from '@/lib/getCsrfToken';
import OrderHeader from '@/components/orders/OrderHeader';
import OrderStatus from '@/components/orders/OrderStatus';
import OrderItems from '@/components/orders/OrderItems';
import ShippingAndPayment from '@/components/orders/ShippingAndPayment';
import OrderSummary from '@/components/orders/OrderSummary';
import CancelOrderButton from '@/components/orders/CancelOrderButton';

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
      <OrderHeader orderId={orderId} />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
        <div className="min-w-0 space-y-5">
          <OrderStatus isCanceled={isCanceled} />
          <OrderItems />
          <ShippingAndPayment />
        </div>
        <OrderSummary>
          <CancelOrderButton
            isCanceled={isCanceled}
            isConfirming={isConfirming}
            isCanceling={isCanceling}
            error={error}
            onCancel={cancelOrder}
            onConfirm={() => setIsConfirming(true)}
            onKeepOrder={() => {
              setIsConfirming(false);
              setError('');
            }}
          />
        </OrderSummary>
      </div>
    </div>
  );
}
