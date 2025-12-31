import HeaderMedia from './HeaderMedia';
import Footer from '@/components/layout/footer/Footer';
import { headers } from 'next/headers';


export default async function RootLayout({ children }) {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';

  return (
    <div className="flex min-h-screen flex-col">
      <HeaderMedia userAgent={userAgent} />
      <div className="flex flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
