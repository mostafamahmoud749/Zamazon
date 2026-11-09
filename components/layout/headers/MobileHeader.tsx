'use client';
import Button from '@/components/common/Button';
import { Menu, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import MUserNav from '@/components/layout/user/MUserNav';
import Sidebar from '@/components/layout/navigations/Sidebar';
import { useContext, useState } from 'react';
import Navigations from '@/components/layout/navigations/Navigations';
import Search from '@/components/common/Search';
import HSidebarMobile from '@/components/layout/navigations/HSidebarMobile';
import MSidebar from '@/components/layout/navigations/MSidebar';
import Logo from '@/components/common/Logo';
import { JSX } from 'react';
import type { NavItem } from '@/types/index';
import { CartContext } from '@/components/cart/CartProvider';

type MobileHeaderProps = {
  navs: NavItem[];
};

export default function MobileHeader({ navs }: MobileHeaderProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const { totalProductsCount } = useContext(CartContext);
  function toggle(): void {
    setOpen((prev: boolean): boolean => !prev);
  }

  return (
    <header className="bg-dark_blue p-2 text-white">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            className="flex h-8 w-6 shrink-0 cursor-pointer items-center justify-center"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => toggle()}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
          <Logo />
        </div>
        <div className="flex items-center">
          <MUserNav />
          <Link
            href="/cart"
            className="relative ml-3 flex h-8 w-8 shrink-0 items-center justify-center"
            aria-label={`Cart, ${totalProductsCount} ${totalProductsCount === 1 ? 'item' : 'items'}`}
          >
            <ShoppingCart className="h-8 w-8" aria-hidden="true" />
            <span className="bg-dark_blue absolute -top-1 left-5 -translate-x-1/2 px-0.5 text-sm leading-none font-bold text-amber-400">
              {totalProductsCount}
            </span>
          </Link>
        </div>
      </nav>
      <Search />

      <div className="flex max-w-full items-center gap-3 overflow-hidden">
        <Link
          href="/orders"
          className="flex h-8 shrink-0 items-center border-1 border-transparent px-2 text-sm font-semibold hover:border-white"
        >
          Returns &amp; Orders
        </Link>
        <div className="min-w-0 flex-1">
          <Navigations H={true} navs={navs} />
        </div>
      </div>
      <Sidebar
        main={<MSidebar navs={navs} onClose={() => setOpen(false)} />}
        header={<HSidebarMobile />}
        toggle={() => toggle()}
        open={open}
      />
    </header>
  );
}
