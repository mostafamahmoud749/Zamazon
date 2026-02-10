'use client';

import { signOut } from 'next-auth/react';

export default function Signout() {
  return (
    <button className="w-full cursor-pointer text-start text-rose-700" onClick={() => signOut()}>
      Signout
    </button>
  );
}
