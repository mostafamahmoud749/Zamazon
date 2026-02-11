'use client';
import Link from 'next/link';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';
import { useState } from 'react';

type NavigationsProps = {
  py: boolean;
  H: boolean;
  navs: NavItem[];
  toggle: () => void;
};

export default function Navigations({ py, H, navs = [], toggle }: Partial<NavigationsProps>) {
  const [showMore, setShowMore] = useState(false);
  const showNavs: JSX.Element[] = navs.map((el) => (
    <Link
      key={el.key}
      onClick={toggle}
      href={`/deals?filters=${encodeURIComponent(JSON.stringify(el))}`}
      className={`${py ? 'py-2' : ''} block transition-all duration-200  ${H ? '' : 'hover:translate-x-1 hover:bg-gray-100'} pl-4 text-sm ${H ? 'flex-shrink-0 first:pl-0' : 'w-full'}`}
    >
      {el.key}
    </Link>
  ));

  function toggleShowMore() {
    setShowMore((prev) => !prev);
  }

  return (
    <div className="">
      <div
        className={`p-1 ${
          H
            ? 'scrollbar-hide flex w-full max-w-full gap-3 overflow-x-auto scroll-smooth '
            : `overflow-y-auto ${showMore ? 'max-h-[60vh]' : 'max-h-[20vh]'}`
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
      {!H ? (
        <button onClick={toggleShowMore} className="mt-2 flex justify-end w-full my-2 px-4 text-sm text-blue-500 cursor-pointer hover:underline">
          {showMore ? 'Show Less' : 'Show More'}
        </button>
      ) : null}
    </div>
  );
}
