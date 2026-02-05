'use client';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

type Props = {
  callbackUrl?: string;
};

export default function SigninWithGoogle({ callbackUrl = '/' }: Props) {
  return (
    <button
      onClick={() => signIn('google', { redirect: true, callbackUrl })}
      className="flex cursor-pointer items-center gap-2 rounded border p-2"
    >
      <FcGoogle size={22} /> Sign in with Google
    </button>
  );
}
