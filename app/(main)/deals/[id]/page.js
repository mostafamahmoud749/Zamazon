import { fetchProducts } from '@/hooks/fetchProducts';
export default async function DealsDetailsPage({params}) {
  const res = await fetchProducts(`https://fakestoreapi.com/products/${params?.id}`);
  console.log(res);
  return (
    <>

    </>
  );
}
