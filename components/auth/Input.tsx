import type { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string[];
};

export default function Input({ label, error, ...inputProps }: InputProps) {
  return (
    <div className="mb-4 w-full font-bold">
      <label>
        {label}
        <input className="w-full border-1 border-gray-600 p-2 font-medium" {...inputProps} />
      </label>
      {error?.map((message) => (
        <p key={message} className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600">
          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
          <span>{message}</span>
        </p>
      ))}
    </div>
  );
}
