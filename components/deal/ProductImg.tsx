import Image from 'next/image';

type ProductImgProps = {
  img: string;
};

export default function ProductImg({ img }: ProductImgProps) {
  return (
    <div className="relative m-auto aspect-square w-full max-w-[450px]">
      <Image
        src={img}
        fill
        sizes="(max-width: 768px) 100vw, 450px"
        alt="Product"
        className="object-contain"
      />
    </div>
  );
}
