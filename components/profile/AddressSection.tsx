'use client';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import AddressForm from '@/components/profile/AddressForm';
import Address from '@/components/profile/Address';

export default function AddressSection() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="border-b border-gray-200 py-8">
      <div
        className="flex cursor-pointer items-center justify-between gap-3"
        onClick={() => setOpen((prev) => !prev)}
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
          <Address
            name={`Mostafa Ahmed`}
            street={`12 El Tahrir Street, Apartment 4`}
            state={`Dokki`}
            city={`Giza`}
            postalCode={`12611`}
            country={`Egypt`}
            isDefault={true}
          />
          <AddressForm />
        </div>
      </div>
    </div>
  );
}
