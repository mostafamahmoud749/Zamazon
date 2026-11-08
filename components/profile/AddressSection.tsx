'use client';
import { ChevronDown } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'next/navigation';
import { UserContext } from '../auth/UserProvider';
import AddressForm from '@/components/profile/AddressForm';
import Address from '@/components/profile/Address';
import type { AddressData } from '@/types';

export default function AddressSection() {
  const searchParams = useSearchParams();
  const open = searchParams.get('section') === 'addresses';
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const { user } = useContext(UserContext);

  function toggleAddresses() {
    const params = new URLSearchParams(searchParams.toString());
    if (open) {
      params.delete('section');
    } else {
      params.set('section', 'addresses');
    }
    const query = params.toString();
    window.history.replaceState(null, '', query ? `/profile?${query}` : '/profile');
  }

  useEffect(() => {
    async function fetchAddresses() {
      try {
        const response = await fetch('/api/addresses');

        if (response.status === 401) {
          throw new Error('You must sign in to view addresses');
        }

        if (!response.ok) {
          throw new Error('Failed to fetch addresses');
        }

        const data = await response.json();
        setAddresses(data);
      } catch (error) {
        console.error('Error while fetching addresses:', error);
      }
    }

    fetchAddresses();
  }, []);

  const sortedAddresses = [...addresses].sort(
    (a, b) => Number(b.id === user?.defaultAddressId) - Number(a.id === user?.defaultAddressId),
  );

  const showAddresses = sortedAddresses.map((address) => (
    <Address
      key={address.id}
      id={address.id}
      name={user?.name}
      street={address.street}
      state={address.state}
      city={address.city}
      postalCode={address.postalCode}
      country={address.country}
      isDefault={user?.defaultAddressId === address.id}
      setAddresses={setAddresses}
    />
  ));

  return (
    <div id="addresses" className="scroll-mt-6 border-b border-gray-200 py-8">
      <div
        className="flex cursor-pointer items-center justify-between gap-3"
        onClick={toggleAddresses}
      >
        <h2 className="text-xl font-semibold tracking-tight">Your addresses</h2>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-500 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          {showAddresses}
          <AddressForm setAddresses={setAddresses} />
        </div>
      </div>
    </div>
  );
}
