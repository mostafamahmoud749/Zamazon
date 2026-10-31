'use client';
import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';

export default function PaymentSection() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="pt-8">
      <div
        className="flex items-center justify-between gap-3"
        onClick={() => setOpen((prev) => !prev)}
      >
        <h2 className="text-xl font-semibold tracking-tight">Payment methods</h2>
        <ChevronDown
          size={20}
          className={`shrink-0 text-gray-500 transition-transform duration-300 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />{' '}
      </div>
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'visible grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="mt-6">
            <li className="flex items-start justify-between gap-4">
              <div className="flex flex-wrap items-start gap-3">
                <span className="rounded border border-gray-200 px-2 py-1 text-xs font-bold text-blue-900 italic">
                  VISA
                </span>
                <div>
                  <h3 className="text-sm font-semibold">Visa ending in 4242</h3>
                  <p className="mt-1 text-sm text-gray-600">Mostafa Ahmed</p>
                  <p className="mt-1 text-sm text-gray-600">Expires 12/2028</p>
                </div>
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
          Add payment method
        </button>
      </div>
    </div>
  );
}
