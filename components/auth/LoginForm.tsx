'use client';
import Form from '@/components/common/Form';

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import SigninWithGithub from '@/components/auth/SigninWithGithub';
import { useState, useContext } from 'react';
import { LoginSchema } from '@/schemas/Auth.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';
import { useRouter } from 'next/navigation';
import { UserContext } from './UserProvider';

type LoginFormProps = {
  callbackUrl: string;
  onResult: (result: { success: boolean; message: string } | null) => void;
};

export default function LoginForm({ onResult, callbackUrl }: LoginFormProps) {
  const { refreshUser } = useContext(UserContext);
  const router = useRouter();
  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string[];
    password?: string[];
  }>({});

  async function handleLogin() {
    onResult(null);

    const result = LoginSchema.safeParse(data);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error ||
            (response.status === 401
              ? 'Invalid email or password.'
              : 'Could not log in. Please try again.'),
        );
      }

      await refreshUser();
      const destination =
        callbackUrl.startsWith('/') && !callbackUrl.startsWith('//') && !callbackUrl.includes('\\')
          ? callbackUrl
          : '/';
      router.replace(destination);
      router.refresh();
    } catch (error) {
      onResult({
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
      console.error('Error during login:', error);
    }
  }

  return (
    <Form className="mx-4" onSubmit={handleLogin}>
      <Input
        variant="auth"
        type="email"
        label="Email or phone number"
        name="email"
        autoComplete="email"
        error={fieldErrors.email}
        value={data.email}
        onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
      />
      <Input
        variant="auth"
        type="password"
        label="Password"
        name="password"
        autoComplete="current-password"
        error={fieldErrors.password}
        value={data.password}
        onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
      />
      <div className="mb-4 flex flex-col gap-3">
        <SigninWithGithub />
      </div>
      <Button
        className="mb-4 w-full cursor-pointer rounded-2xl bg-amber-300 p-2 text-center transition-all duration-200 enabled:hover:bg-amber-400"
        type="submit"
        loadingText="Signing in..."
      >
        continue
      </Button>
    </Form>
  );
}
