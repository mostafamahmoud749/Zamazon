'use client';
import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';

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
          <ul className="mt-6">
            <li className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="font-semibold">Home</h3>
                  <span className="text-xs text-gray-500">Default address</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Mostafa Ahmed
                  <br />
                  12 El Tahrir Street, Apartment 4
                  <br />
                  Dokki, Giza 12611, Egypt
                  <br />
                  +20 100 123 4567
                </p>
              </div>
              <button
                type="button"
                className="focus-visible:outline-dark_blue shrink-0 cursor-pointer py-1 text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Remove
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 flex">
        <button
          type="button"
          className="focus-visible:outline-dark_blue inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <Plus size={16} />
          Add address
        </button>
      </div>
    </div>
  );
}
