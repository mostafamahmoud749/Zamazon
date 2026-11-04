'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateAddressSchema } from '@/schemas/Address.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';
import type { AddressData } from '@/types';

type AddressFormProps = {
  setAddresses: React.Dispatch<React.SetStateAction<AddressData[]>>;
};

export default function AddressForm({ setAddresses }: AddressFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    street?: string[];
    city?: string[];
    state?: string[];
    postalCode?: string[];
    country?: string[];
  }>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const result = CreateAddressSchema.safeParse(address);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/addresses', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(address),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error);
      }

      setAddresses((prev) => [...prev, data]);
    } catch (error) {
      console.log('error from adding address:', error);
    }
  }

  return (
    <>
      {showForm ? (
        <form
          onSubmit={(event) => handleSubmit(event)}
          className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5"
        >
          <h3 className="text-dark font-semibold">Add an address</h3>
          <label className="text-dark block text-sm font-medium">
            Street address
            <input
              type="text"
              name="street"
              value={address.street}
              onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
              autoComplete="street-address"
              placeholder="Street, building, and apartment number"
              className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
            />
            {fieldErrors.street?.map((message) => (
              <span key={message} className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600">
                <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
                <span>{message}</span>
              </span>
            ))}
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-dark block text-sm font-medium">
              City
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
                autoComplete="address-level2"
                placeholder="City"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
              />
              {fieldErrors.city?.map((message) => (
                <span key={message} className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span>{message}</span>
                </span>
              ))}
            </label>
            <label className="text-dark block text-sm font-medium">
              State / Governorate
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
                autoComplete="address-level1"
                placeholder="State or governorate"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
              />
              {fieldErrors.state?.map((message) => (
                <span key={message} className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span>{message}</span>
                </span>
              ))}
            </label>
            <label className="text-dark block text-sm font-medium">
              Postal code
              <input
                type="text"
                name="postalCode"
                value={address.postalCode}
                onChange={(e) => setAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
                autoComplete="postal-code"
                placeholder="Postal code"
                className="mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
              />
              {fieldErrors.postalCode?.map((message) => (
                <span key={message} className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span>{message}</span>
                </span>
              ))}
            </label>
            <label className="text-dark block text-sm font-medium">
              Country
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={(e) => setAddress((prev) => ({ ...prev, country: e.target.value }))}
                autoComplete="country-name"
                placeholder="Country"
                className="rounYourded-md mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
              />
              {fieldErrors.country?.map((message) => (
                <span key={message} className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600">
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
                  <span>{message}</span>
                </span>
              ))}
            </label>
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="submit"
              className="bg-yellow text-dark focus-visible:outline-dark_blue cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Save address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="focus-visible:outline-dark_blue cursor-pointer rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6 flex">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="focus-visible:outline-dark_blue inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Plus size={16} />
            Add address
          </button>
        </div>
      )}
    </>
  );
}
