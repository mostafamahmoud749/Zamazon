import Navigations from '@/components/layout/navigations/Navigations';
import Link from 'next/link';
import { House } from 'lucide-react';
import Signout from '@/components/auth/Signout';
import { JSX } from 'react';
import type {NavItem} from "@/types/index"
type MSidebarProps = {
  my?:boolean
  navs:NavItem[]
  toggle:()=>void
}

export default function MSidebar({ my, navs, toggle }:MSidebarProps):JSX.Element {
  return (
    <>
      <Link onClick={toggle} href="/" className="flex justify-between p-4">
        <span className="text-lg font-bold">Zamazon Home</span>
        <House />
      </Link>
      <div className="border-y-4 border-gray-300 p-4">
        <p className="mb-4">Trending</p>
        <Link onClick={toggle} className="block w-full transition-all duration-200 hover:ml-1" href={`/deals?filters=${encodeURIComponent(JSON.stringify({group: 'departments', key: 'electronics'}))}`}>
          Electronics
        </Link>
      </div>
      <Navigations my={my} navs={navs} toggle={toggle} />
      <div className="border-t-4 transition-all duration-200 border-gray-300 hover:ml-1  p-4">
        <Signout />
      </div>
    </>
  );
}
