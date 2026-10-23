'use client';

import Input from '@/components/auth/Input';
import Button from '@/components/common/Button';
import SigninWithGithub from '@/components/auth/SigninWithGithub';
import SigninWithGoogle from '@/components/auth/SigninWithGoogle';
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

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onResult(null);

    const result = LoginSchema.safeParse(data);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${process.env.API_URL}/api/auth/login`, {
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
      router.replace('/');
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
    <form className="mx-4" onSubmit={handleLogin}>
      <Input
        type="email"
        label="Email or phone number"
        name="email"
        autoComplete="email"
        error={fieldErrors.email}
        value={data.email}
        onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
      />
      <Input
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
        <SigninWithGoogle callbackUrl={callbackUrl} />
      </div>
      <Button
        color="bg-amber-300"
        hoverdColor="hover:bg-amber-400"
        padding="p-2"
        margin="mb-4"
        rounded="rounded-2xl"
        type="submit"
      >
        continue
      </Button>
    </form>
  );
}
