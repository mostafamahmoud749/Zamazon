import Link from 'next/link';
import Image from 'next/image';

export default function CartItem({ product }) {
  return (
    <div className="my-2 flex gap-4 rounded-b-sm px-2 pt-1">
      <Image
        className="object-fit max-h-[135px] "
        width={145}
        height={135}
        src={product.image}
        alt="product image"
      ></Image>
      <div>
        <div className="md:flex md:gap-5">
          <div className="line-clamp-2 overflow-hidden font-light md:text-lg md:font-medium">
            {product.description}
          </div>
          <div className="text-xl font-semibold">{product.price}$</div>
        </div>
        <div className="flex max-h-8 max-w-30 items-center justify-between gap-2 rounded-3xl border-3 border-amber-300 px-2 md:mt-2">
          <button className="cursor-pointer text-xl"> - </button>
          <div>1</div>
          <button className="cursor-pointer text-xl">+</button>
        </div>
      </div>
    </div>
  );
}
