'use client';

import { createContext, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, FormEvent } from 'react';

export const FormPendingContext = createContext(false);

type FormProps = Omit<ComponentPropsWithoutRef<'form'>, 'onSubmit'> & {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void | Promise<void>;
};

export default function Form({ onSubmit, ...props }: FormProps) {
  const [isPending, setIsPending] = useState(false);
  const inFlight = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;

    inFlight.current = true;
    setIsPending(true);
    try {
      await onSubmit(event);
    } finally {
      inFlight.current = false;
      setIsPending(false);
    }
  }

  return (
    <FormPendingContext.Provider value={isPending}>
      <form {...props} onSubmit={handleSubmit} />
    </FormPendingContext.Provider>
  );
}
