import HeaderMedia from './HeaderMedia';
import Footer from '@/components/layout/footer/Footer';
import { headers } from 'next/headers';
import { CartProvider } from '@/components/cart/CartProvider';

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  return (
    <div className="flex min-h-screen flex-col">
      <CartProvider>
        <HeaderMedia userAgent={userAgent} />
        <div className="flex flex-1 flex-col">{children}</div>
      </CartProvider>
      <Footer />
    </div>
  );
}
