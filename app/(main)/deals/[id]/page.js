import { fetchProducts } from '@/lib/fetchProducts';
import DealMedia from './DealMedia';
import { headers } from 'next/headers';


export default async function DealsDetailsPage({ params }) {
  const res = await fetchProducts(`https://fakestoreapi.com/products/${params?.id}`);
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  return <>
  {<DealMedia userAgent={userAgent} product={res}/>}
  </>;
}
