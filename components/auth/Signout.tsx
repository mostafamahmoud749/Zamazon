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
      className="block w-full cursor-pointer py-2 pl-4 text-start text-sm text-rose-700 transition-all duration-200 hover:translate-x-1 hover:bg-gray-100"
      onClick={() => logoutUser()}
    >
      Signout
    </button>
  );
}
