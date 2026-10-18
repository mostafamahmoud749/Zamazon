'use client';
import { signIn } from 'next-auth/react';
import { FaGithub } from 'react-icons/fa';

type Props = {
  callbackUrl?: string;
};

export default function SigninWithGithub({ callbackUrl = '/' }: Props) {
  function signInWithGithub() {
    window.location.href = 'http://localhost:9000/api/auth/github';
  }

  return (
    <button
      onClick={() => signInWithGithub()}
      className="flex cursor-pointer items-center gap-2 rounded border p-2"
    >
      <FaGithub size={22} /> Sign in with GitHub
    </button>
  );
}
