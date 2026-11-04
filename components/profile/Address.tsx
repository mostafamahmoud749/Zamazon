import { useState } from 'react';
import AddressForm from './AddressForm';
import { getCsrfToken } from '@/lib/getCsrfToken';
import type { AddressData } from '@/types';

type AddressProps = {
  name?: string | null;
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  setAddresses: React.Dispatch<React.SetStateAction<AddressData[]>>;
};

export default function Address({
  name,
  id,
  street,
  city,
  state,
  postalCode,
  country,
  isDefault,
  setAddresses,
}: AddressProps) {
  const [open, setOpen] = useState(false);

  async function removeAddress() {
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (response.status === 409) {
        throw new Error('address is used by order');
      }
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      console.log('error while deleting address:', error);
    }
  }

  return (
    <ul className="mt-6">
      <li className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="font-semibold">Home</h3>
            {isDefault && <span className="text-xs text-gray-500">Default address</span>}
          </div>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            {name}
            <br />
            {street}
            <br />
            {city}, {state} {postalCode}, {country}{' '}
          </p>
        </div>
        <div className="flex shrink-0 gap-4">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="focus-visible:outline-dark_blue cursor-pointer py-1 text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => removeAddress()}
            className="focus-visible:outline-dark_blue shrink-0 cursor-pointer py-1 text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Remove
          </button>
        </div>
      </li>
      {open && (
        <li>
          <AddressForm
            initialAddress={{ id, street, city, state, postalCode, country }}
            setAddresses={setAddresses}
            onClose={() => setOpen(false)}
          />
        </li>
      )}
    </ul>
  );
}
