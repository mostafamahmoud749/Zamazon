import { fetchProducts } from '@/lib/fetchProducts';
import CartItem from '@/components/cart/CartItem';
import CartList from '@/components/cart/CartList';
export default async function FilledCart () {
    const res = await fetchProducts(`https://fakestoreapi.com/products/3`);

    return(
    <div className="mb-5 md:px-5 md:pt-3  bg-white py-2 md:flex md:flex-col-reverse">
        <CartList />
        <hr className='border-amber-300 md:mt-3 md:border-gray-300 md:mx-3'></hr>
        <div className='px-3 my-2 '>
            <div className='md:text-3xl md:block hidden '> 
                Shopping Cart
            </div>
            <div className='md:flex hidden'>
                <div className='ml-auto text-sm text-gray-600'>price</div>
            </div>
            <CartItem product={res} />
            <CartItem product={res} />
        </div>
    </div>
  );
}