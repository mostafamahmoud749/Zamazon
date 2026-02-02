'use client';
import Link from 'next/link';
import { MapPin, ShoppingCart } from 'lucide-react';
import Search from '@/components/common/Search';
import Navigations from '@/components/layout/navigations/Navigations';
import Sidebar from '@/components/layout/navigations/Sidebar';
import { useState } from 'react';
import HSidebarDesktop from '@/components/layout/navigations/HSidebarDesktop';
import DUserNav from '@/components/layout/user/DUserNav';
import MSidebar from '@/components/layout/navigations/MSidebar';
import MergeText from '@/components/layout/headers/MergeText';
import Logo from '@/components/common/Logo';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';

type DesktopHeaderProps = {
  navs: NavItem[];
};

export default function DesktopHeader({ navs }: DesktopHeaderProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  function toggle(): void {
    setOpen((prev:boolean):boolean => !prev);
  }
  return (
    <header className="bg-dark text-white">
      <nav className="flex items-center justify-between gap-4 px-4 py-0.5">
        <Logo />

        <div className="flex items-end gap-1">
          <MapPin className="h-5 w-5" />
          <MergeText top="Deliver to" bottom="Egypt" />
        </div>

        <Search />

        <DUserNav />

        <Link href="/orders">
          <MergeText top="Returns" bottom="& Orders" />
        </Link>

        <Link href="/cart" className="flex items-end gap-1">
          <ShoppingCart className="h-8 w-8" />
          <span className="text-sm font-bold">Cart</span>
        </Link>
      </nav>
      <div className="bg-dark_blue flex items-center gap-1 py-1 pl-4">
        <div onClick={() => toggle()} className="mr-4 flex cursor-pointer items-center text-xl">
          ☰<span className="ml-1 text-sm font-bold">All</span>
        </div>
        <Navigations H={true} navs={navs} my={false} />
      </div>
      <Sidebar
        border={true}
        main={<MSidebar my={true} navs={navs} toggle={() => toggle()} />}
        header={<HSidebarDesktop />}
        toggle={() => toggle()}
        open={open}
      />
    </header>
  );
}
