'use client';

import Navigations from '@/components/layout/navigations/Navigations';
import Link from 'next/link';
import { House } from 'lucide-react';
import Signout from '@/components/auth/Signout';
import type { JSX } from 'react';
import type { NavItem } from '@/types/index';
import { useContext } from 'react';
import { UserContext } from '@/components/auth/UserProvider';

type MSidebarProps = {
  py?: boolean;
  navs: NavItem[];
  toggle: () => void;
};

export default function MSidebar({ py, navs, toggle }: MSidebarProps): JSX.Element {
  const { status } = useContext(UserContext);

  return (
    <>
      <Link onClick={toggle} href="/" className="flex justify-between p-4">
        <span className="text-lg font-bold">Zamazon Home</span>
        <House />
      </Link>
      <div className="border-y-4 border-gray-300 p-4">
        <p className="mb-2">Trending</p>
        <Link
          onClick={toggle}
          className="block w-full py-2 transition-all duration-200 hover:ml-1 hover:bg-gray-100"
          href={`/deals?filters=${encodeURIComponent(JSON.stringify({ group: 'departments', key: 'electronics' }))}`}
        >
          Electronics
        </Link>
      </div>
      <Navigations py={py} navs={navs} toggle={toggle} />
      {status === 'authenticated' && (
        <div className="border-t-4 border-gray-300 p-1">
          <Signout />
        </div>
      )}
    </>
  );
}
