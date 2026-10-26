'use client';
import { FaGithub } from 'react-icons/fa';

type Props = {
  callbackUrl?: string;
};

export default function SigninWithGithub() {
  return (
    <button
      type="button"
      onClick={() => {
        window.location.href = `${process.env.API_URL}/api/auth/github`;
      }}
      className="flex cursor-pointer items-center gap-2 rounded border p-2"
    >
      <FaGithub size={22} /> Sign in with GitHub
    </button>
  );
}
