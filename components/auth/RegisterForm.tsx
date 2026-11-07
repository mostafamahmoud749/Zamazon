'use client';
import Form from '@/components/common/Form';

import { useState } from 'react';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { RegisterSchema } from '@/schemas/Auth.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';

type RegisterFormProps = {
  onResult: (result: { success: boolean; message: string } | null) => void;
};

export default function RegisterForm({ onResult }: RegisterFormProps) {
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string[];
    email?: string[];
    password?: string[];
  }>({});

  async function handleRegister() {
    onResult(null);

    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Could not create account. Please try again.');
      }
      onResult({ success: true, message: 'Account created successfully!' });
    } catch (error) {
      onResult({
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
      console.error('Error during registration:', error);
    }
  }

  return (
    <Form className="mx-4" onSubmit={handleRegister}>
      <Input
        variant="auth"
        type="text"
        error={fieldErrors.name}
        label="First and last name"
        name="name"
        value={data.name}
        onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
      />
      <Input
        variant="auth"
        type="email"
        error={fieldErrors.email}
        label="Mobile number or email"
        name="email"
        value={data.email}
        onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
      />
      <Input
        variant="auth"
        type="password"
        error={fieldErrors.password}
        label="Create a password"
        name="password"
        value={data.password}
        onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
      />
      <Button
        className="mb-4 w-full cursor-pointer rounded-2xl bg-amber-300 p-2 text-center transition-all duration-200 enabled:hover:bg-amber-400"
        type="submit"
        loadingText="Creating account..."
      >
        continue
      </Button>
    </Form>
  );
}
