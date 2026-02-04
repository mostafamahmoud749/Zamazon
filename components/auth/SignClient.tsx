'use client';

import Input from '@/components/auth/Input';
import Form from '@/components/auth/Form';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';
import SigninWithGithub from '@/components/auth/SigninWithGithub';
import SigninWithGoogle from '@/components/auth/SigninWithGoogle';
import { useSearchParams, useRouter } from 'next/navigation';

export default function SignClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const S: string | null = searchParams.get('s');

  const [newUser, setNewUser] = useState<boolean>(S === 'signin' ? false : true);

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
  return (
    <main className="m-auto w-full max-w-[400px] rounded-md border-1 border-gray-200 bg-white shadow-sm md:mt-6">
      <Form selected={newUser} toggle={toggle} text="Create account" textq="New to Zamazon?">
        <div className="mx-4">
          <Input type="text" label="First and last name" name="" />
          <Input type="email" label="Mobile number or email" name="" />
          <Input type="password" label="Create a password" name="" />
          <Button
            color="bg-amber-300"
            hoverdColor="hover:bg-amber-400"
            padding="p-2"
            margin="mb-4"
            rounded="rounded-2xl"
          >
            continue
          </Button>
        </div>
      </Form>

      <Form selected={!newUser} toggle={toggle} text="Sign in" textq="Already a customer?">
        <div className="mx-4">
          <Input type="email" label="Email or phone number" name="" />
          <div className="mb-4 flex flex-col gap-3">
            <SigninWithGithub />
            <SigninWithGoogle />
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
        </div>
      </Form>
    </main>
  );
}
