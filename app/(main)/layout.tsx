import HeaderMedia from './HeaderMedia';
import Footer from '@/components/layout/footer/Footer';
import { headers } from 'next/headers';
import { CartProvider } from '@/components/cart/CartProvider';
import { JSX, ReactNode } from 'react';
import CartSidebar from '@/components/cart/CartSidebar';

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}): Promise<JSX.Element> {
  const headersList = await headers();
  const userAgent: string = headersList.get('user-agent') || '';

  return (
    <CartProvider>

      <div className="flex max-w-[100vw] overflow-x-hidden">
        <div className="flex min-h-screen flex-1 flex-col overflow-hidden">
          <HeaderMedia userAgent={userAgent} />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
        </div>
        {/* cart items sidebar */}
        <CartSidebar />
      </div>
    </CartProvider>
  );
}
