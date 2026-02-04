'use client';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import MUserNav from '@/components/layout/user/MUserNav';
import Sidebar from '@/components/layout/navigations/Sidebar';
import { useState } from 'react';
import Navigations from '@/components/layout/navigations/Navigations';
import Search from '@/components/common/Search';
import HSidebarMobile from '@/components/layout/navigations/HSidebarMobile';
import MSidebar from '@/components/layout/navigations/MSidebar';
import Logo from '@/components/common/Logo';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';
import type { Session } from 'next-auth';

type MobileHeaderProps = {
  navs: NavItem[];
  session: Session | null;
};

export default function MobileHeader({ navs , session }: MobileHeaderProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  function toggle(): void {
    setOpen((prev: boolean): boolean => !prev);
  }

  return (
    <header className="bg-dark_blue p-2 text-white">
      <nav className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="cursor-pointer text-2xl" onClick={() => toggle()}>
            ☰
          </div>
          <Logo />
        </div>
        <div className="flex">
          <MUserNav session={session} />
          <Link href="/cart">
            <ShoppingCart className="ml-3 h-8 w-8" />
          </Link>
        </div>
      </nav>
      <Search />
      <Navigations H={true} navs={navs} />
      <Sidebar
        main={<MSidebar navs={navs} toggle={() => toggle()} session={session} />}
        header={<HSidebarMobile session={session}/>}
        toggle={() => toggle()}
        open={open}
      />
    </header>
  );
}
