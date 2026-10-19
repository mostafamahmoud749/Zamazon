'use client';

import Input from '@/components/auth/Input';
import AuthSection from '@/components/auth/AuthSection';
import Button from '@/components/common/Button';
import Popup from '@/components/common/Popup';
import { useState, useEffect } from 'react';
import SigninWithGithub from '@/components/auth/SigninWithGithub';
import SigninWithGoogle from '@/components/auth/SigninWithGoogle';
import { useSearchParams, useRouter } from 'next/navigation';
import { RegisterSchema } from '@/schemas/Auth.schema';
import { getCsrfToken } from '@/lib/getCsrfToken';

export default function SignClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const S: string | null = searchParams.get('s');
  const callbackUrl: string = searchParams.get('callbackUrl') || '/';

  const [newUser, setNewUser] = useState<boolean>(S === 'signin' ? false : true);
  const [popup, setPopup] = useState<{ success: boolean; message: string } | null>(null);

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

  function toggle(selected: boolean): void {
    if (!selected) {
      const next = !newUser;
      setNewUser(next);
      router.push(`/sign?s=${next ? 'signup' : 'signin'}`);
    }
  }

  useEffect(() => {
    setNewUser(S === 'signin' ? false : true);
  }, [S]);

  useEffect(() => {
    if (!popup) return;
    const timeout = setTimeout(() => setPopup(null), 8000);
    return () => clearTimeout(timeout);
  }, [popup]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPopup(null);

    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      setFieldErrors(result.error.flatten().fieldErrors);
      console.log(fieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch('http://localhost:9000/api/auth/register', {
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
      setPopup({ success: true, message: 'Account created successfully!' });
    } catch (error) {
      setPopup({
        success: false,
        message: error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      });
      console.error('Error during registration:', error);
    }
  }

  return (
    <main className="m-auto w-full max-w-[400px] rounded-md border-1 border-gray-200 bg-white shadow-sm md:mt-6">
      {popup && (
        <Popup success={popup.success} message={popup.message} onClose={() => setPopup(null)} />
      )}
      <AuthSection selected={newUser} toggle={toggle} text="Create account" textq="New to Zamazon?">
        <form className="mx-4" onSubmit={handleSubmit}>
          <Input
            type="text"
            error={fieldErrors.name}
            label="First and last name"
            name="name"
            value={data.name}
            onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          />
          <Input
            type="email"
            error={fieldErrors.email}
            label="Mobile number or email"
            name="email"
            value={data.email}
            onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          />
          <Input
            type="password"
            error={fieldErrors.password}
            label="Create a password"
            name="password"
            value={data.password}
            onChange={(e) => setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          />
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
      </AuthSection>

      <AuthSection selected={!newUser} toggle={toggle} text="Sign in" textq="Already a customer?">
        <form className="mx-4">
          <Input type="email" label="Email or phone number" name="" />
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
          >
            continue
          </Button>
        </form>
      </AuthSection>
    </main>
  );
}
