'use client';
import { useState, useEffect } from 'react';
import OrdersCard from '@/components/orders/OrdersCard';
import type { OrderSummary } from '@/types/orders';

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOrders() {
      try {
        const response = await fetch('/api/orders', {
          credentials: 'include',
          signal: controller.signal,
        });

        if (response.status === 401) {
          throw new Error('Please sign in to view your orders.');
        }
        if (!response.ok) {
          throw new Error('Could not load your orders. Please try again.');
        }

        const data: OrderSummary[] = await response.json();
        if (!controller.signal.aborted) setOrders(data);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error('Error happened while fetching orders!:', error);
        setError(
          error instanceof Error ? error.message : 'Could not load your orders. Please try again.',
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    void fetchOrders();
    return () => controller.abort();
  }, []);

  return (
    <div className="text-dark mx-auto my-4 w-11/12 max-w-6xl bg-white px-4 py-5 md:px-8 md:py-6">
      <h1 className="mb-6 text-2xl md:text-3xl">Your Orders</h1>

      {isLoading && <p>Loading your orders…</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && orders.length === 0 && <p>You haven’t placed any orders yet.</p>}

      {orders.length > 0 && (
        <>
          <div className="hidden grid-cols-[minmax(0,1fr)_8rem_7rem_9rem] gap-6 px-3 pb-3 text-sm text-gray-500 md:grid">
            <span>Order</span>
            <span>Status</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          <ul className="divide-y divide-gray-200 border-y border-gray-200">
            {orders.map((order) => (
              <OrdersCard
                key={order.id}
                id={order.id}
                status={order.status}
                date={new Date(order.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                total={Number(order.totalAmount)}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
