import { fetchProducts } from '@/lib/fetchProducts';
import DealMedia from './DealMedia';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';


export default async function DealsDetailsPage({ params }) {
  const product = await fetchProducts(`https://fakestoreapi.com/products/${params?.id}`);
  if (!product || Array.isArray(product)) notFound();
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  return <>
  {<DealMedia userAgent={userAgent} product={product}/>}
  </>;
}
