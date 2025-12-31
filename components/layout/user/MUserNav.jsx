import Link from 'next/link';
import { ChevronRight, UserRound } from 'lucide-react';

export default function MUserNav() {
  return (
    <Link href="/signin" className="flex items-center">
      <div className="text-sm">Sign in</div>
      <ChevronRight className="h-4 w-4" />
      <UserRound className="h-8 w-8" />
    </Link>
  );
}
