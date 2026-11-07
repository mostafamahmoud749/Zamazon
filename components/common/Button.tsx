'use client';

import { useContext, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import { FormPendingContext } from '@/components/common/Form';

type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> & {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  loading?: boolean;
  loadingText?: ReactNode;
};

export default function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  loading = false,
  loadingText,
  className = '',
  ...props
}: ButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const inFlight = useRef(false);
  const isFormPending = useContext(FormPendingContext);
  const isLoading = loading || isPending || (type === 'submit' && isFormPending);
  const isDisabled = disabled || isLoading || isFormPending;

  async function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (isDisabled || inFlight.current) {
      event.preventDefault();
      return;
    }
    if (!onClick) return;

    inFlight.current = true;
    try {
      const result = onClick(event);
      if (result && typeof result.then === 'function') {
        setIsPending(true);
        await result;
      }
    } finally {
      inFlight.current = false;
      setIsPending(false);
    }
  }

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      onClick={handleClick}
      className={`${className} disabled:cursor-not-allowed disabled:opacity-70`}
    >
      {isLoading && loadingText !== undefined ? loadingText : children}
    </button>
  );
}
