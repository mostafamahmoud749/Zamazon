import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';

export default function DUserNav({ big }) {
  return (
    <>
      {big ? (
        <Link href="/signin" className="flex items-center gap-3 pl-4">
          <CircleUserRound className="h-8 w-8" />
          <p className="text-xl">Hello, Sign in</p>
        </Link>
      ) : (
        <Link href="/signin" className="flex items-center gap-1">
          <CircleUserRound />
          <p className="text-xs">Hello, Sign in</p>
        </Link>
      )}
    </>
  );
}
