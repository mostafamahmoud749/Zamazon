'use client';
import Button from '@/components/common/Button';
import { FaGithub } from 'react-icons/fa';

export default function SigninWithGithub() {
  return (
    <Button
      type="button"
      onClick={() => {
        window.location.href = '/api/auth/github';
      }}
      className="flex cursor-pointer items-center gap-2 rounded border p-2"
    >
      <FaGithub size={22} /> Sign in with GitHub
    </Button>
  );
}
