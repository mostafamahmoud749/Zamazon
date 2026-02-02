import MUserNav from '@/components/layout/user/MUserNav';
import Link from 'next/link';
import { JSX } from 'react';

export default function HSidebarMobile():JSX.Element {
  return (
    <>
      <div className="flex justify-end">
        <MUserNav />
      </div>
      <Link href="/">
        <p className="text-xl font-bold">Browse</p>
        <p className="text-2xl font-bold">Zamazon</p>
      </Link>
    </>
  );
}
