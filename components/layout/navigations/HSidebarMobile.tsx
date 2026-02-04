import MUserNav from '@/components/layout/user/MUserNav';
import Link from 'next/link';
import type { Session } from 'next-auth';

type HSidebarMobileProps={
  session: Session | null;
}
export default function HSidebarMobile({session}:HSidebarMobileProps) {
  return (
    <>
      <div className="flex justify-end">
        <MUserNav session={session} />
      </div>
      <Link href="/">
        <p className="text-xl font-bold">Browse</p>
        <p className="text-2xl font-bold">Zamazon</p>
      </Link>
    </>
  );
}
