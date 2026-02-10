import Link from 'next/link';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';

type NavigationsProps = {
  my: boolean;
  H: boolean;
  navs: NavItem[];
  toggle: () => void;
};

export default function Navigations({ my, H, navs = [], toggle }: Partial<NavigationsProps>) {
  const showNavs: JSX.Element[] = navs.map((el) => (
    <Link
      key={el.key}
      onClick={toggle}
      href={`/deals?filters=${encodeURIComponent(JSON.stringify(el))}`}
      className={`${my ? 'my-4' : ''} block transition-all duration-200 ${H ? '' : 'hover:ml-1'} pl-4 text-sm ${H ? 'flex-shrink-0 first:pl-0' : 'w-full'}`}
    >
      {el.key}
    </Link>
  ));

  return (
    <div
      className={`p-1 ${
        H ? 'scrollbar-hide flex w-full max-w-full gap-3 overflow-x-auto scroll-smooth' : ''
      }`}
    >
      <Link
        href="/deals"
        className={`${my ? 'my-4' : ''} block pl-4 text-sm transition-all duration-200 ${H ? 'flex-shrink-0 first:pl-0' : 'w-full hover:ml-1'}`}
      >
        Todays Deals
      </Link>
      {showNavs}
    </div>
  );
}
