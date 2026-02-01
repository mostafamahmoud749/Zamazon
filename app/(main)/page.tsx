import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import SeeSign from '@/components/auth/SeeSign';
import { fetchProducts } from '@/lib/fetchProducts';
import ProductCard from '@/components/product/ProductCard';
import type { Session } from 'next-auth';
import type { Product } from '@/types/product';
import type { JSX } from 'react';


export default async function Home(): Promise<JSX.Element> {
  const [productsResult, sessionResult] = await Promise.allSettled([
    fetchProducts('https://fakestoreapi.com/products'),
    getServerSession(authOptions),
  ]);

  const productsRaw: unknown = productsResult.status === 'fulfilled' ? productsResult.value : null;
  const session: Session | null = sessionResult.status === 'fulfilled' ? sessionResult.value : null;

  const products: Product[] = Array.isArray(productsRaw)
    ? productsRaw
    : [];

  const showProducts:JSX.Element[] = products
    .filter((_, index) => index < 12)
    .map((el) => <ProductCard key={el.id} el={el} />);

  return (
    <div className="flex flex-col md:bg-gray-200">
      <div className="mx-auto grid w-199/200 flex-1 grid-cols-2 gap-5 px-6 py-2 md:w-4/5 md:grid-cols-4 md:bg-white">
        {showProducts.length ? (
          showProducts
        ) : (
          <p className="col-span-full py-6 text-center text-gray-600">
            Products are unavailable right now.
          </p>
        )}
      </div>
      {!session && <SeeSign />}
    </div>
  );
}
