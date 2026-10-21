'use client';
import { useState } from 'react';
import Image from 'next/image';

type ProductImgProps = {
  img: string;
};

export default function ProductImg({ img }: ProductImgProps) {
  const [failedImage, setFailedImage] = useState<string | null>(null);
  return (
    <div className="relative m-auto aspect-square w-full max-w-[450px]">
      <Image
        src={!img || failedImage === img ? '/products/demo-product.svg' : img}
        onError={() => setFailedImage(img)}
        fill
        sizes="(max-width: 768px) 100vw, 450px"
        alt="Product"
        className="object-contain"
      />
    </div>
  );
}
