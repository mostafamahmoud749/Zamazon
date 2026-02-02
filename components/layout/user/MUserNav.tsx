import Link from 'next/link';
import { ChevronRight, UserRound } from 'lucide-react';
import { JSX } from 'react';

export default function MUserNav():JSX.Element {
  return (
    <Link href="/sign?s=signin" className="flex items-center">
      <div className="text-sm">Sign in</div>
      <ChevronRight className="h-4 w-4" />
      <UserRound className="h-8 w-8" />
    </Link>
  );
}
