import { fetchProducts } from '@/lib/fetchProducts';
import DealMedia from './DealMedia';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import type { Product } from '@/types/product';
import type { JSX } from 'react';

type DealsDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DealsDetailsPage({
  params,
}: DealsDetailsPageProps): Promise<JSX.Element> {
  const { id } = await params;
  const res = await fetchProducts(`https://dummyjson.com/products/${id}`);
  if (!res || Array.isArray(res)) notFound();

  const product = res as Product;

  const headersList = await headers();
  const userAgent: string = headersList.get('user-agent') ?? '';

  return (
    <>
      <DealMedia userAgent={userAgent} product={product} />
    </>
  );
}
