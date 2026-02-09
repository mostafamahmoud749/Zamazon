import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/index';

type ProductCardProps = {
  el: Product;
};


export default function ProductCard({ el }: ProductCardProps) {
  return (
    <Link
      href={`/deals/${el.id}`}
      className="flex h-64 w-full min-w-0 flex-col items-center justify-between overflow-hidden rounded-md bg-gray-100 p-2 shadow-md transition hover:shadow-lg"
    >
      <div className="flex h-40 w-full items-center justify-center overflow-hidden">
        <Image
          src={el.image}
          width={200}
          height={200}
          alt={el.title}
          className="max-h-full max-w-full object-contain"
          sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 180px"
        />
      </div>
      <p className="line-clamp-2 text-center text-sm font-medium text-gray-700">{el.title}</p>
    </Link>
  );
}
