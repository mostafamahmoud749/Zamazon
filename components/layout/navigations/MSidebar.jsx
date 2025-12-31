import Navigations from '@/components/layout/navigations/Navigations';
import Link from 'next/link';
import { House } from 'lucide-react';
import Signout from '@/components/auth/Signout';

export default function MSidebar({ my, navs, toggle }) {
  return (
    <>
      <Link onClick={toggle} href="/" className="flex justify-between p-4">
        <span className="text-lg font-bold">Zamazon Home</span>
        <House />
      </Link>
      <div className="border-y-4 border-gray-300 p-4">
        <p className="mb-4">Trending</p>
        <Link onClick={toggle} className="block w-full" href="/PC">
          PC
        </Link>
      </div>
      <Navigations my={my} navs={navs} toggle={toggle} />
      <div className="border-t-4 border-gray-300 p-4">
        <Signout />
      </div>
    </>
  );
}
