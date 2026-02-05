import MobileHeader from '@/components/layout/headers/MobileHeader';
import DesktopHeader from '@/components/layout/headers/DesktopHeader';
import { fetchCategories } from '@/lib/fetchCategories';
import type { JSX } from 'react';
import type {NavItem} from "@/types/index"
import type { Session } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

export default async function HeaderMedia({ userAgent }: { userAgent?: string }): Promise<JSX.Element> {
  const isMobile: boolean = /Mobi|Android/i.test(userAgent ?? '');
  const session: Session | null=await getServerSession(authOptions)
  let categories:string[] = [];
  try {
    categories = await fetchCategories('https://fakestoreapi.com/products/categories');
  } catch {
    categories = [];
  }

  const navs: NavItem[] = (
    categories.length ? categories.sort() : ['Home', 'Health & Household', 'Books', 'PC', 'clothes']
  ).map((category) => ({ group: 'departments', key: category }));
  
  return isMobile ? <MobileHeader navs={navs} session={session} /> : <DesktopHeader navs={navs} session={session} />;
}
