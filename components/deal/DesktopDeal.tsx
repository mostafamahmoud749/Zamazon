import Details from '@/components/deal/Details';
import ProductImg from '@/components/deal/ProductImg';
import Buy from '@/components/deal/Buy';
import type { Product } from '@/types/index';

type DesktopDealProps = {
  product: Product;
};

export default function DesktopDeal({ product }: DesktopDealProps) {
  return (
    <div className="m-auto mt-8 flex w-5/6 justify-center gap-4">
      <div className="max-w-[450px] flex-1">
        <ProductImg img={product.image} />
      </div>
      <div className="max-w-[800px] flex-2">
        <Details data={{ title: product.title, rating: product.rating }} m={true} />
        <Buy product={product} />
      </div>
    </div>
  );
}
