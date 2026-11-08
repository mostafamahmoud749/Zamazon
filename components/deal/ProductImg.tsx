'use client';
import { useState } from 'react';
import Image from 'next/image';
import Skeleton from '@/components/common/Skeleton';

type ProductImgProps = {
  img: string;
};

export default function ProductImg({ img }: ProductImgProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const imageSrc = !img || failedImage === img ? '/products/demo-product.svg' : img;
  const isImageLoading = loadedImage !== imageSrc;
  return (
    <div className="relative m-auto aspect-square w-full max-w-[450px]">
      {isImageLoading && <Skeleton className="absolute inset-0" />}
      <Image
        src={imageSrc}
        onLoad={() => setLoadedImage(imageSrc)}
        onError={() => setFailedImage(img)}
        fill
        sizes="(max-width: 768px) 100vw, 450px"
        alt="Product"
        className={`object-contain transition-opacity ${isImageLoading ? 'opacity-0' : 'opacity-100'}`}
      />
    </div>
  );
}
