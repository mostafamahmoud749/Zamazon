import MobileHeader from '@/components/layout/headers/MobileHeader';
import DesktopHeader from '@/components/layout/headers/DesktopHeader';
import { fetchCategories } from '@/lib/fetchCategories';

export default async function HeaderMedia({ userAgent }) {
  const isMobile = /Mobi|Android/i.test(userAgent);

  let categories = [];
  try {
    categories = await fetchCategories('https://fakestoreapi.com/products/categories');
  } catch {
    categories = [];
  }

  const navs = (
    categories.length ? categories.sort() : ['Home', 'Health & Household', 'Books', 'PC', 'clothes']
  ).map((category) => ({ group: 'departments', key: category }));

  return isMobile ? <MobileHeader navs={navs} /> : <DesktopHeader navs={navs} />;
}
