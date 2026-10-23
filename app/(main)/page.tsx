import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth';
import SeeSign from '@/components/auth/SeeSign';
import { fetchProducts } from '@/lib/fetchProducts';
import HomeProducts from '@/components/product/HomeProducts';
import type { Product } from '@/types/index';
import type { JSX } from 'react';

export default async function Home(): Promise<JSX.Element> {
  const [productsResult] = await Promise.allSettled([
    fetchProducts(`${process.env.API_URL}/api/products`),
    getServerSession(authOptions),
  ]);

  const productsRaw: unknown = productsResult.status === 'fulfilled' ? productsResult.value : null;

  const products: Product[] = Array.isArray(productsRaw) ? productsRaw : [];

  return (
    <div className="flex flex-1 flex-col md:bg-gray-200">
      <div className="mx-auto grid w-199/200 flex-1 grid-cols-2 gap-5 px-6 py-4 md:w-4/5 md:grid-cols-4 md:bg-white">
        <HomeProducts products={products} />
      </div>
      <SeeSign />
    </div>
  );
}
