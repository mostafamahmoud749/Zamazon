'use client';
import Form from '@/components/common/Form';
import Button from '@/components/common/Button';
import { useState } from 'react';
import Input from '@/components/common/Input';
import { Plus } from 'lucide-react';
import { CreateAddressSchema, PatchAddressSchema } from '@/schemas/Address.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';
import type { AddressData } from '@/types';

type AddressFormProps = {
  setAddresses: React.Dispatch<React.SetStateAction<AddressData[]>>;
  initialAddress?: AddressData;
  onClose?: () => void;
};

export default function AddressForm({ setAddresses, initialAddress, onClose }: AddressFormProps) {
  const [showForm, setShowForm] = useState(Boolean(initialAddress));
  const [address, setAddress] = useState({
    street: initialAddress?.street ?? '',
    city: initialAddress?.city ?? '',
    state: initialAddress?.state ?? '',
    postalCode: initialAddress?.postalCode ?? '',
    country: initialAddress?.country ?? '',
  });
  const [fieldErrors, setFieldErrors] = useState<{
    street?: string[];
    city?: string[];
    state?: string[];
    postalCode?: string[];
    country?: string[];
  }>({});

  async function handleSubmit() {
    const schema = initialAddress ? PatchAddressSchema : CreateAddressSchema;
    const result = schema.safeParse(address);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(
        initialAddress ? `/api/addresses/${initialAddress.id}` : '/api/addresses',
        {
          method: initialAddress ? 'PATCH' : 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify(result.data),
        },
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error);
      }

      setAddresses((prev) =>
        initialAddress
          ? prev.map((item) => (item.id === initialAddress.id ? data : item))
          : [...prev, data],
      );
      if (!initialAddress) {
        setAddress({
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
        });
      }
      setShowForm(false);
      onClose?.();
    } catch (error) {
      console.log('error from saving address:', error);
    }
  }

  return (
    <>
      {showForm ? (
        <Form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5"
        >
          <h3 className="text-dark font-semibold">
            {initialAddress ? 'Edit address' : 'Add an address'}
          </h3>
          <Input
            label="Street address"
            error={fieldErrors.street}
            type="text"
            name="street"
            value={address.street}
            onChange={(e) => setAddress((prev) => ({ ...prev, street: e.target.value }))}
            autoComplete="street-address"
            placeholder="Street, building, and apartment number"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="City"
              error={fieldErrors.city}
              type="text"
              name="city"
              value={address.city}
              onChange={(e) => setAddress((prev) => ({ ...prev, city: e.target.value }))}
              autoComplete="address-level2"
              placeholder="City"
            />
            <Input
              label="State / Governorate"
              error={fieldErrors.state}
              type="text"
              name="state"
              value={address.state}
              onChange={(e) => setAddress((prev) => ({ ...prev, state: e.target.value }))}
              autoComplete="address-level1"
              placeholder="State or governorate"
            />
            <Input
              label="Postal code"
              error={fieldErrors.postalCode}
              type="text"
              name="postalCode"
              value={address.postalCode}
              onChange={(e) => setAddress((prev) => ({ ...prev, postalCode: e.target.value }))}
              autoComplete="postal-code"
              placeholder="Postal code"
            />
            <Input
              label="Country"
              error={fieldErrors.country}
              type="text"
              name="country"
              value={address.country}
              onChange={(e) => setAddress((prev) => ({ ...prev, country: e.target.value }))}
              autoComplete="country-name"
              placeholder="Country"
              className="rounded-md mt-2 block w-full border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Button
              type="submit"
              loadingText="Saving..."
              className="bg-yellow text-dark focus-visible:outline-dark_blue cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Save address
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowForm(false);
                onClose?.();
              }}
              className="focus-visible:outline-dark_blue cursor-pointer rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Cancel
            </Button>
          </div>
        </Form>
      ) : (
        <div className="mt-6 flex">
          <Button
            type="button"
            onClick={() => setShowForm(true)}
            className="focus-visible:outline-dark_blue inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <Plus size={16} />
            Add address
          </Button>
        </div>
      )}
    </>
  );
}
