import MainDeals from '@/components/deals/MainDeals';
import { fetchProducts } from '@/hooks/fetchProducts';
export default async function DealsPage({}) {
  const res = await fetchProducts('https://fakestoreapi.com/products');


  return (
    <>
      <MainDeals products={res} />
    </>
  );
}
