'use client';
import Button from '@/components/common/Button';
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
      href={`/deals?filters=${encodeURIComponent(JSON.stringify(el.id ? [el.id] : []))}`}
      className={`${py ? 'py-2' : ''} block transition-all duration-200 ${H ? 'flex h-8 flex-shrink-0 items-center justify-center border-1 border-transparent px-2 first:pl-0 hover:border-white' : 'w-full pl-4 hover:translate-x-1 hover:bg-gray-100'} text-sm`}
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
        className={` ${
          H
            ? 'scrollbar-hide flex h-8 w-full max-w-full gap-3 overflow-x-auto scroll-smooth'
            : `overflow-y-auto p-1 ${showMore ? 'max-h-[60vh]' : 'max-h-[20vh]'}`
        }`}
      >
        <Link
          href="/deals"
          className={`${py ? 'py-2' : ''} block text-sm transition-all duration-200 ${H ? 'flex h-8 flex-shrink-0 items-center justify-center border-1 border-transparent px-2 hover:border-white' : 'w-full pl-4 hover:translate-x-1 hover:bg-gray-100'}`}
        >
          Today&apos;s Deals
        </Link>
        {showNavs}
      </div>
      {!H ? (
        <Button
          onClick={toggleShowMore}
          className="my-2 mt-2 flex w-full cursor-pointer justify-end px-4 text-sm text-blue-500 hover:underline"
        >
          {showMore ? 'Show Less' : 'Show More'}
        </Button>
      ) : null}
    </div>
  );
}
