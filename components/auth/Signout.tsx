'use client';

import { getCsrfToken } from '@/lib/getCsrfToken';
import { useRouter } from 'next/navigation';

export default function Signout() {
  const router = useRouter();
  async function logout() {
    const csrfToken = await getCsrfToken();

    const response = await fetch('http://localhost:9000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken,
      },
    });

    if (response.ok) {
      router.replace('/');
      router.refresh();
    }
  }

  return (
    <button
      className="w-full cursor-pointer text-start text-rose-700 hover:bg-gray-100"
      onClick={() => logout()}
    >
      Signout
    </button>
  );
}
