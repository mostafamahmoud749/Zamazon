'use client';

import { signOut } from 'next-auth/react';

export default function Signout() {
  return (
    <button className="w-full hover:bg-gray-100 cursor-pointer text-start text-rose-700" onClick={() => signOut()}>
      Signout
    </button>
  );
}
