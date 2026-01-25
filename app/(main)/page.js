import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import SeeSign from '@/components/auth/SeeSign';
import { fetchProducts } from '@/lib/fetchProducts';
import ProductCard from '@/components/product/ProductCard';

export default async function Home() {
  const [products, session] = await Promise.all([
    fetchProducts('https://fakestoreapi.com/products'),
    getServerSession(authOptions),
  ]);

  const showProducts = products
    .filter((_, index) => index < 12)
    .map((el) => <ProductCard key={el.id} el={el} />);
  return (
    <div className="flex flex-col md:bg-gray-200">
      <div className="mx-auto grid w-199/200 flex-1 grid-cols-2 gap-5 px-6 py-2 md:w-4/5 md:grid-cols-4 md:bg-white">
        {showProducts}
      </div>
      {!session && <SeeSign />}
    </div>
  );
}
