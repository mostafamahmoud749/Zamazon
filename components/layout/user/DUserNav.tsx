import { CircleUserRound } from 'lucide-react';
import Link from 'next/link';
import { JSX } from 'react';

type DUserNavProps={
  big?:boolean
}

export default function DUserNav({ big }:DUserNavProps):JSX.Element {
  return (
    <>
      {big ? (
        <Link href="/sign?s=signin" className="flex items-center gap-3 pl-4">
          <CircleUserRound className="h-8 w-8" />
          <p className="text-xl">Hello, Sign in</p>
        </Link>
      ) : (
        <Link href="/sign?s=signin" className="flex items-center gap-1">
          <CircleUserRound />
          <p className="text-xs">Hello, Sign in</p>
        </Link>
      )}
    </>
  );
}
