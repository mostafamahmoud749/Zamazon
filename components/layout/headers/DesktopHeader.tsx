'use client';
import Link from 'next/link';
import { MapPin, ShoppingCart } from 'lucide-react';
import Search from '@/components/common/Search';
import Navigations from '@/components/layout/navigations/Navigations';
import Sidebar from '@/components/layout/navigations/Sidebar';
import { useState, useContext } from 'react';
import HSidebarDesktop from '@/components/layout/navigations/HSidebarDesktop';
import DUserNav from '@/components/layout/user/DUserNav';
import MSidebar from '@/components/layout/navigations/MSidebar';
import MergeText from '@/components/common/MergeText';
import Logo from '@/components/common/Logo';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';
import type { Session } from 'next-auth';
import { CartContext } from '@/components/cart/CartProvider';

type DesktopHeaderProps = {
  navs: NavItem[];
  session: Session | null;
};

export default function DesktopHeader({ navs, session }: DesktopHeaderProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const { totalProductsCount } = useContext(CartContext);

  function toggle(): void {
    setOpen((prev: boolean): boolean => !prev);
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

        <DUserNav session={session} />

        <Link href="/orders">
          <MergeText top="Returns" bottom="& Orders" />
        </Link>

        <Link href="/cart" className="-mt-4 flex items-end gap-1">
          <div className="flex flex-col items-center justify-center">
            <div className="relative top-3 font-bold text-amber-400">{totalProductsCount}</div>
            <ShoppingCart className="h-8 w-8" />
          </div>
          <span className="text-sm font-bold">Cart</span>
        </Link>
      </nav>

      <div className="bg-dark_blue flex items-center gap-1 overflow-hidden py-1 pl-4">
        <button
          onClick={() => toggle()}
          className="mr-4 flex flex-shrink-0 cursor-pointer items-center text-xl"
        >
          ☰<span className="ml-1 text-sm font-bold">All</span>
        </button>
        <div className="min-w-0 flex-1">
          <Navigations H={true} navs={navs} my={false} />
        </div>
      </div>
      <Sidebar
        border={true}
        main={<MSidebar my={true} navs={navs} toggle={() => toggle()} session={session} />}
        header={<HSidebarDesktop session={session} />}
        toggle={() => toggle()}
        open={open}
      />
    </header>
  );
}
