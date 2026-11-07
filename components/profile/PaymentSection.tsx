'use client';
import Button from '@/components/common/Button';
import { ChevronDown, Plus } from 'lucide-react';
import { useState } from 'react';
import Input from '@/components/common/Input';

export default function PaymentSection() {
  const [open, setOpen] = useState<boolean>(false);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="pt-8">
      <div
        className="flex cursor-pointer items-center justify-between gap-3"
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
              <Button
                type="button"
                className="focus-visible:outline-dark_blue shrink-0 cursor-pointer py-1 text-sm text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-red-700 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Remove
              </Button>
            </li>
          </ul>
          {showForm ? (
            <form
              onSubmit={(event) => event.preventDefault()}
              className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-5"
            >
              <h3 className="text-dark font-semibold">Add a payment method</h3>
              <Input
                label="Name on card"
                type="text"
                name="cardholderName"
                autoComplete="cc-name"
                placeholder="Full name as shown on card"
              />
              <Input
                label="Card number"
                type="text"
                name="cardNumber"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="1234 5678 9012 3456"
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Expiry date"
                  type="text"
                  name="expiryDate"
                  inputMode="numeric"
                  autoComplete="cc-exp"
                  placeholder="MM/YY"
                  maxLength={5}
                />
                <Input
                  label="Security code"
                  type="password"
                  name="securityCode"
                  inputMode="numeric"
                  autoComplete="cc-csc"
                  placeholder="CVC"
                  maxLength={4}
                />
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button
                  type="button"
                  className="bg-yellow text-dark focus-visible:outline-dark_blue cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium transition-colors hover:bg-yellow-400 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Save payment method
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="focus-visible:outline-dark_blue cursor-pointer rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 flex">
              <Button
                type="button"
                onClick={() => setShowForm(true)}
                className="focus-visible:outline-dark_blue inline-flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2.5 text-sm font-medium hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Plus size={16} />
                Add payment method
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
