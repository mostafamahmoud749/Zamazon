'use client';
import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import type { Session } from 'next-auth';
import { useContext } from 'react';
import { UserContext } from '@/components/auth/UserProvider';

type DUserNavProps = {
  big?: boolean;
};

export default function DUserNav({ big }: DUserNavProps) {
  const { user, status } = useContext(UserContext);
  const text: string =
    status === 'authenticated' ? `Hello, ${user?.name?.split(' ')[0] ?? '?'}` : 'Hello, Sign in';
  return (
    <>
      {big ? (
        <Link href="/sign?s=signin" className="flex items-center gap-3 pl-4">
          <CircleUserRound className="h-8 w-8" />
          <p className="text-xl">{text}</p>
        </Link>
      ) : (
        <Link href="/sign?s=signin" className="flex items-center gap-1">
          <CircleUserRound />
          <p className="text-xs">{text}</p>
        </Link>
      )}
    </>
  );
}
