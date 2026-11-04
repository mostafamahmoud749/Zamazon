import { useContext, useState } from 'react';
import AddressForm from './AddressForm';
import { UserContext } from '@/components/auth/UserProvider';
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
  const [settingDefault, setSettingDefault] = useState(false);
  const { refreshUser } = useContext(UserContext);

  async function setDefaultAddress() {
    if (settingDefault) return;
    setSettingDefault(true);

    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch('/api/users/me/default-address', {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ defaultAddressId: id }),
      });

      if (!response.ok) {
        throw new Error('Could not set the default address');
      }

      await refreshUser();
    } catch (error) {
      console.log('error while setting default address:', error);
    } finally {
      setSettingDefault(false);
    }
  }

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
      <li className="flex items-start justify-between gap-6">
        <div className="min-w-0 break-words">
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
        <div className="flex shrink-0 flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="focus-visible:outline-dark_blue cursor-pointer text-sm leading-6 text-gray-600 underline-offset-4 hover:text-sky-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Edit
          </button>
          {!isDefault && (
            <button
              type="button"
              onClick={setDefaultAddress}
              disabled={settingDefault}
              className="focus-visible:outline-dark_blue cursor-pointer text-sm leading-6 text-sky-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {settingDefault ? 'Saving...' : 'Set as default'}
            </button>
          )}
          <button
            type="button"
            onClick={() => removeAddress()}
            className="focus-visible:outline-dark_blue cursor-pointer text-sm leading-6 text-gray-500 underline-offset-4 hover:text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
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
