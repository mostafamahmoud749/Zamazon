import Link from 'next/link';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';

type NavigationsProps = {
  py: boolean;
  H: boolean;
  navs: NavItem[];
  toggle: () => void;
};

export default function Navigations({ py, H, navs = [], toggle }: Partial<NavigationsProps>) {
  const showNavs: JSX.Element[] = navs.map((el) => (
    <Link
      key={el.key}
      onClick={toggle}
      href={`/deals?filters=${encodeURIComponent(JSON.stringify(el))}`}
      className={`${py ? 'py-2' : ''} block transition-all hover:bg-gray-100 duration-200 ${H ? '' : 'hover:translate-x-1'} pl-4 text-sm ${H ? 'flex-shrink-0 first:pl-0' : 'w-full'}`}
    >
      {el.key}
    </Link>
  ));

  return (
    <div
      className={`p-1 ${
        H
          ? 'scrollbar-hide flex w-full hover:bg-gray-100 max-w-full gap-3 overflow-x-auto scroll-smooth'
          : 'max-h-[70vh] overflow-y-auto'
      }`}
    >
      <Link
        href="/deals"
        className={`${py ? 'py-2' : ''} block pl-4 text-sm transition-all duration-200 ${H ? 'flex-shrink-0 first:pl-0' : 'w-full hover:translate-x-1'}`}
      >
        Todays Deals
      </Link>
      {showNavs}
    </div>
  );
}
