'use client';

import { getCsrfToken } from '@/lib/getCsrfToken';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from './UserProvider';

export default function Signout() {
  const { logout } = useContext(UserContext);
  const router = useRouter();
  async function logoutUser() {
    const csrfToken = await getCsrfToken();

    const response = await fetch(`${process.env.API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    if (response.ok) {
      logout();
      router.replace('/');
      router.refresh();
    }
  }

  return (
    <button
      className="w-full cursor-pointer text-start text-rose-700 hover:bg-gray-100"
      onClick={() => logoutUser()}
    >
      Signout
    </button>
  );
}
