'use client';
import Button from '@/components/common/Button';

import { getCsrfToken } from '@/lib/getCsrfToken';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function Signout({ onSuccess }: { onSuccess?: () => void }) {
  const { logout } = useContext(UserContext);
  const router = useRouter();
  async function logoutUser() {
    const csrfToken = await getCsrfToken();

    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    if (response.ok) {
      await logout();
      onSuccess?.();
      router.replace('/');
      router.refresh();
    }
  }

  return (
    <Button
      className="block w-full cursor-pointer py-2 pl-4 text-start text-sm text-rose-700 transition-all duration-200 hover:translate-x-1 hover:bg-gray-100"
      onClick={logoutUser}
    >
      Sign out
    </Button>
  );
}
