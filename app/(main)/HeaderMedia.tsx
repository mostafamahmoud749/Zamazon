import MobileHeader from '@/components/layout/headers/MobileHeader';
import DesktopHeader from '@/components/layout/headers/DesktopHeader';
import { fetchCategories } from '@/lib/fetchCategories';
import type { JSX } from 'react';

type NavItem = {
  group: string;
  key: string;
};

export default async function HeaderMedia({ userAgent }: { userAgent?: string }): Promise<JSX.Element> {
  const isMobile: boolean = /Mobi|Android/i.test(userAgent ?? '');

  let categories:string[] = [];
  try {
    categories = await fetchCategories('https://fakestoreapi.com/products/categories');
  } catch {
    categories = [];
  }

  const navs: NavItem[] = (
    categories.length ? categories.sort() : ['Home', 'Health & Household', 'Books', 'PC', 'clothes']
  ).map((category) => ({ group: 'departments', key: category }));

  return isMobile ? <MobileHeader navs={navs} /> : <DesktopHeader navs={navs} />;
}
