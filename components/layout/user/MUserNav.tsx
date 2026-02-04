import Link from 'next/link';
import { ChevronRight, UserRound } from 'lucide-react';
import type { Session } from 'next-auth';

type MUserNavProps = {
  session: Session | null;
};

export default function MUserNav({session}:MUserNavProps){
  const text: string = session?.user ? `Hello, ${session.user.name?.split(" ")[0]}` : 'Hello, Sign in';

  return (
    <Link href="/sign?s=signin" className="flex items-center">
      <div className="text-sm">{text}</div>
      <ChevronRight className="h-4 w-4" />
      <UserRound className="h-8 w-8" />
    </Link>
  );
}
