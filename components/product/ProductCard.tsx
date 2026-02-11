import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/index';
import ExtraDetails from '@/components/product/ExtraDetails';

type ProductCardProps = {
  el: Product;
  deals?: boolean;
};

export default function ProductCard({ el, deals }: ProductCardProps) {
  return (
    <div className="flex h-80 w-full min-w-0 flex-col justify-between overflow-hidden rounded-md bg-gray-100 p-2 shadow-md transition hover:shadow-lg">
      <Link
        href={`/deals/${el.id}`}
        className="flex h-40 flex-1 w-full items-center justify-center overflow-hidden"
      >
        <Image
          src={el.image}
          width={200}
          height={200}
          alt={el.title}
          className="object-contain"
          sizes="(max-width: 768px) 40vw, (max-width: 1200px) 20vw, 180px"
        />
      </Link>
      {deals ? (
        <ExtraDetails el={el} />
      ) : (
        <p className="line-clamp-2 text-center text-sm font-medium text-gray-700">{el.title}</p>
      )}
    </div>
  );
}
