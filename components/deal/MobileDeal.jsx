import Details from '@/components/deal/Details';
import ProductImg from '@/components/deal/ProductImg';
import Buy from '@/components/deal/Buy';

export default function MobileDeal({ product }) {
  return (
    <div className=" bg-gray-50 px-2 py-4 lg:max-w-3/4 m-auto">
      <div className="mx-auto  overflow-hidden rounded-xl bg-white shadow-lg">
        <ProductImg img={product.image} />
        <div className="px-4 pt-2 pb-4">
          <Details data={{ title: product.title, rating: product.rating }} m={true} />
          <Buy product={product} />
        </div>
      </div>
    </div>
  );
}
