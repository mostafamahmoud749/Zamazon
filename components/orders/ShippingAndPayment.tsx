import { Banknote, MapPin } from 'lucide-react';
import type { AddressData } from '@/types/address';

export default function ShippingAndPayment({
  address,
  paymentMethod,
}: {
  address: AddressData;
  paymentMethod: string;
}) {
  const paymentLabel =
    paymentMethod === 'cash'
      ? 'Cash on delivery'
      : paymentMethod === 'card' || paymentMethod === 'CREDIT_CARD'
        ? 'Credit card'
        : paymentMethod.replaceAll('_', ' ');

  return (
    <section className="grid rounded-2xl border border-gray-200 bg-white sm:grid-cols-2">
      <div className="p-5 sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <MapPin size={17} className="text-gray-500" aria-hidden="true" />
          Shipping address
        </h2>
        <address className="mt-4 space-y-1 text-sm leading-relaxed text-gray-600 not-italic">
          <p>{address.street}</p>
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
        </address>
      </div>
      <div className="border-t border-gray-100 p-5 sm:border-t-0 sm:border-l sm:p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Banknote size={17} className="text-gray-500" aria-hidden="true" />
          Payment method
        </h2>
        <p className="mt-4 text-sm font-medium">{paymentLabel}</p>
        {paymentMethod === 'cash' && (
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Payment is collected when your order arrives.
          </p>
        )}
      </div>
    </section>
  );
}
