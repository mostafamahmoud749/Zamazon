import type { ComponentPropsWithoutRef } from 'react';

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string;
  error?: string[];
  variant?: 'auth' | 'profile';
};

export default function Input({
  label,
  error,
  variant = 'profile',
  className,
  ...inputProps
}: InputProps) {
  const isAuth = variant === 'auth';
  const ErrorElement = isAuth ? 'p' : 'span';
  const errors = error?.map((message) => (
    <ErrorElement
      key={message}
      className="mt-1 flex items-start gap-2 text-sm font-normal text-red-600"
    >
      <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-current" />
      <span>{message}</span>
    </ErrorElement>
  ));

  const field = (
    <label className={isAuth ? undefined : 'text-dark block text-sm font-medium'}>
      {label}
      <input
        className={
          className ??
          (isAuth
            ? 'w-full border-1 border-gray-600 p-2 font-medium'
            : 'mt-2 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:border-sky-700 focus:ring-1 focus:ring-sky-700 focus:outline-none')
        }
        {...inputProps}
      />
      {!isAuth && errors}
    </label>
  );

  return isAuth ? (
    <div className="mb-4 w-full font-bold">
      {field}
      {errors}
    </div>
  ) : (
    field
  );
}
