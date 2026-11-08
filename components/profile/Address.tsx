import Button from '@/components/common/Button';
import Popup from '@/components/common/Popup';
import { useContext, useEffect, useState } from 'react';
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
  const [errorMessage, setErrorMessage] = useState('');
  const { refreshUser } = useContext(UserContext);

  useEffect(() => {
    if (!errorMessage) return;
    const timeout = setTimeout(() => setErrorMessage(''), 8000);
    return () => clearTimeout(timeout);
  }, [errorMessage]);

  async function setDefaultAddress() {
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
    }
  }

  async function removeAddress() {
    setErrorMessage('');
    try {
      const csrfToken = await getCsrfToken();
      const response = await fetch(`/api/addresses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!response.ok) {
        const messages: Record<number, string> = {
          401: 'Please sign in to remove your address.',
          403: 'Your session could not be verified. Please refresh and try again.',
          404: 'This address could not be found.',
          409: 'This address is used by an order and cannot be removed.',
        };
        throw new Error(
          messages[response.status] || 'Could not remove your address. Please try again.',
        );
      }

      setAddresses((prev) => prev.filter((address) => address.id !== id));
    } catch (error) {
      console.log('error while deleting address:', error);
      setErrorMessage(
        error instanceof Error ? error.message : 'Could not remove your address. Please try again.',
      );
    }
  }

  return (
    <>
      {errorMessage && (
        <Popup success={false} message={errorMessage} onClose={() => setErrorMessage('')} />
      )}
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
            <Button
              type="button"
              onClick={() => setOpen(true)}
              className="focus-visible:outline-dark_blue cursor-pointer text-sm leading-6 text-gray-600 underline-offset-4 hover:text-sky-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Edit
            </Button>
            {!isDefault && (
              <Button
                type="button"
                onClick={setDefaultAddress}
                loadingText="Saving..."
                className="focus-visible:outline-dark_blue cursor-pointer text-sm leading-6 text-sky-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Set as default
              </Button>
            )}
            <Button
              type="button"
              onClick={removeAddress}
              className="focus-visible:outline-dark_blue cursor-pointer text-sm leading-6 text-gray-500 underline-offset-4 hover:text-red-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Remove
            </Button>
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
    </>
  );
}
