import Details from '@/components/deal/Details';
import ProductImg from '@/components/deal/ProductImg';
import Buy from '@/components/deal/Buy';

export default function DesktopDeal({ product }){
  return(
    <div className='w-5/6 m-auto flex mt-8 gap-4 justify-center'>
      <div className='flex-1 max-w-[450px]'>
        <ProductImg img={product.image} />
      </div>
      <div className='flex-2 max-w-[800px]'>
        <Details data={{ title: product.title, rating: product.rating }} m={true} />
        <Buy product={product}  />
      </div>
    </div>
  )
}