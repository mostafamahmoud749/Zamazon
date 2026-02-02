import Image from 'next/image';
import Link from 'next/link';
import { JSX } from 'react';
import type { Product } from '@/types/index';

type ProductCardProps = {
  el: Product;
};

export default function ProductCard({ el }: ProductCardProps): JSX.Element {
  return (
    <Link
      href={`/deals/${el.id}`}
      className="flex h-80 w-full flex-col items-center justify-between rounded-md bg-gray-100 p-2 shadow-md transition hover:shadow-lg"
    >
      <div className="flex h-56 w-full items-center justify-center">
        <Image
          src={el.image}
          width={500}
          height={500}
          alt={el.title}
          className="max-h-full object-contain"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 200px"
        />
      </div>
      <p className="text-center text-sm font-medium text-gray-700">{el.title}</p>
    </Link>
  );
}
