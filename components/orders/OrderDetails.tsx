'use client';

import { useEffect, useState } from 'react';
import type { OrderDetails as OrderDetailsData } from '@/types/orders';
import { getCsrfToken } from '@/lib/getCsrfToken';
import OrderHeader from '@/components/orders/OrderHeader';
import OrderStatus from '@/components/orders/OrderStatus';
import OrderItems from '@/components/orders/OrderItems';
import ShippingAndPayment from '@/components/orders/ShippingAndPayment';
import OrderSummary from '@/components/orders/OrderSummary';
import CancelOrderButton from '@/components/orders/CancelOrderButton';
import Popup from '@/components/common/Popup';
import { OrderDetailsSkeleton } from '@/components/loading/OrderSkeletons';

export default function OrderDetails({ orderId }: { orderId: number }) {
  const [order, setOrder] = useState<OrderDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [error, setError] = useState('');

  const isCanceled = order?.status === 'CANCELED';

  useEffect(() => {
    if (!error) return;
    const timeout = setTimeout(() => setError(''), 8000);
    return () => clearTimeout(timeout);
  }, [error]);

  useEffect(() => {
    const controller = new AbortController();
    setOrder(null);
    setIsLoading(true);
    setFetchError('');
    setIsConfirming(false);
    setError('');

    async function fetchOrder() {
      try {
        const response = await fetch(`/api/orders/${orderId}`, {
          credentials: 'include',
          signal: controller.signal,
        });

        if (response.status === 401) throw new Error('Please sign in to view your order.');
        if (response.status === 404) throw new Error('This order could not be found.');
        if (!response.ok) throw new Error('Could not load your order. Please try again.');

        const data: OrderDetailsData = await response.json();
        if (!controller.signal.aborted) setOrder(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        setFetchError(
          error instanceof Error ? error.message : 'Could not load your order. Please try again.',
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void fetchOrder();
    return () => controller.abort();
  }, [orderId]);

  async function cancelOrder() {
    if (isCanceling || order?.status !== 'PENDING') return;
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
        if (response.status === 403) {
          throw new Error('Your session could not be verified. Please refresh and try again.');
        }
        if (response.status === 404) throw new Error('This order could not be found.');
        if (response.status === 400) {
          throw new Error('This order is no longer pending and cannot be canceled.');
        }
        throw new Error('Could not cancel your order. Please try again.');
      }

      setOrder((current) => (current ? { ...current, status: 'CANCELED' } : current));
      setIsConfirming(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Could not cancel your order.');
    } finally {
      setIsCanceling(false);
    }
  }

  return (
    <div className="text-dark mx-auto my-6 w-11/12 max-w-6xl md:my-8">
      {error && <Popup success={false} message={error} onClose={() => setError('')} />}
      <OrderHeader orderId={orderId} createdAt={order?.createdAt} />
      {isLoading && <OrderDetailsSkeleton />}
      {fetchError && <p>{fetchError}</p>}
      {!isLoading && order && (
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
          <div className="min-w-0 space-y-5">
            <OrderStatus status={order.status} />
            <OrderItems items={order.orderItems} />
            <ShippingAndPayment address={order.address} paymentMethod={order.paymentMethod} />
          </div>
          <OrderSummary total={Number(order.totalAmount)}>
            {(order.status === 'PENDING' || isCanceled) && (
              <CancelOrderButton
                isCanceled={isCanceled}
                isConfirming={isConfirming}
                isCanceling={isCanceling}
                onCancel={cancelOrder}
                onConfirm={() => setIsConfirming(true)}
                onKeepOrder={() => {
                  setIsConfirming(false);
                  setError('');
                }}
              />
            )}
          </OrderSummary>
        </div>
      )}
    </div>
  );
}
