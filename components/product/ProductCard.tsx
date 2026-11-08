'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types/index';
import ExtraDetails from '@/components/product/ExtraDetails';
import Skeleton from '@/components/common/Skeleton';

type ProductCardProps = {
  el: Product;
  deals?: boolean;
};

export default function ProductCard({ el, deals }: ProductCardProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const imageSrc = !el.image || failedImage === el.image ? '/products/demo-product.svg' : el.image;
  const isImageLoading = loadedImage !== imageSrc;
  return (
    <div className="flex h-80 w-full min-w-0 flex-col justify-between overflow-hidden rounded-md bg-gray-100 p-2 shadow-md transition hover:shadow-lg">
      <Link
        href={`/deals/${el.id}`}
        prefetch={false}
        className="relative flex h-40 min-h-0 w-full flex-1 items-center justify-center overflow-hidden"
      >
        {isImageLoading && <Skeleton className="absolute inset-0" />}
        <Image
          src={imageSrc}
          onLoad={() => setLoadedImage(imageSrc)}
          onError={() => setFailedImage(el.image)}
          width={200}
          height={200}
          alt={el.title}
          className={`relative max-h-full object-contain transition-opacity ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
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
