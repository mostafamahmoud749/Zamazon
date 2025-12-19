import HeaderMedia from './HeaderMedia';
import Footer from '@/components/layout/footer/Footer';
import { headers } from 'next/headers';
import { fetchCategories } from '@/hooks/fetchCategories';

export default async function RootLayout({ children }) {
  const headersList = await headers();

  const categories = await fetchCategories('https://fakestoreapi.com/products/categories');

  const navs = (
    categories.length ? categories.sort() : ['Home', 'Health & Household', 'Books', 'PC', 'clothes']
  ).map((category) => ({ group: 'departments', key: category }));

  const userAgent = headersList.get('user-agent') || '';

  return (
    <div className="flex flex-col">
      <HeaderMedia userAgent={userAgent} navs={navs} />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
