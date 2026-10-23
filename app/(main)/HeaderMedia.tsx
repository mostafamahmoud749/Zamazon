import MobileHeader from '@/components/layout/headers/MobileHeader';
import DesktopHeader from '@/components/layout/headers/DesktopHeader';
import { fetchCategories } from '@/lib/fetchCategories';
import type { JSX } from 'react';

import type { NavItem } from '@/types/index';

export default async function HeaderMedia({
  userAgent,
}: {
  userAgent?: string;
}): Promise<JSX.Element> {
  const isMobile: boolean = /Mobi|Android/i.test(userAgent ?? '');
  let categories: NavItem[] = [];
  try {
    const result = await fetchCategories(`${process.env.API_URL}/api/categories`);
    categories = result
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((category) => ({ id: category.id, group: 'departments', key: category.name }));
  } catch {
    categories = [];
  }

  const navs: NavItem[] = categories;

  return isMobile ? (
    <MobileHeader navs={navs} />
  ) : (
    <DesktopHeader navs={navs} />
  );
}
