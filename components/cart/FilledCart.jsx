import Image from 'next/image';
import Link from 'next/link';
import { fetchProducts } from '@/lib/fetchProducts';

export default async function FilledCart () {
    const res = await fetchProducts(`https://fakestoreapi.com/products/3`);

    return(
    <div className="mb-5 md:px-5 md:pt-3  bg-white py-2 md:flex md:flex-col-reverse">
        <div className='px-3 md:flex md:flex-row-reverse md:justify-between'>
            <div className='flex items-center gap-2 border-b-1 md:border-none md:justify-end md:my-2  border-b-amber-100'>
                <div className='text-xl font-medium'>Subtotal (2 items): </div>
                <div className='font-semibold text-2xl'>000$</div>
            </div>
            <button className='block w-full md:max-w-fit md:my-3  md:px-3 cursor-pointer my-4 rounded-3xl bg-amber-300 py-2'>Proceed to checkout</button>
        </div>
        <hr className='border-amber-300 md:mt-3 md:border-gray-300 md:mx-3'></hr>
        <div className='px-3 my-2 '>
            <div className='md:text-3xl md:block hidden '> 
                Shopping Cart
            </div>
            <div className='md:flex hidden'>
                <div className='ml-auto text-sm text-gray-600'>price</div>
            </div>
            
            <hr className='border-t-1 md:mb-5 border-gray-300'></hr>
            <div className='flex gap-4 bg-gray-50 my-2 px-2 pt-1 rounded-b-sm'>
                <Image className='max-h-[135px] object-fit' width={145} height={135} src={res.image} alt='product image'></Image>
                <div>
                    <div className='md:flex  md:gap-5'>
                        <div className='font-light line-clamp-2 overflow-hidden md:text-lg md:font-medium'>{res.description}</div>
                        <div className='text-xl font-semibold'>{res.price}$</div>
                    </div>
                    <div className='max-h-8 flex gap-2 max-w-30 items-center justify-between border-3 border-amber-300 px-2 rounded-3xl'>
                        <button className='text-xl cursor-pointer'> - </button>
                        <div>1</div>
                        <button className='text-xl cursor-pointer'>+</button>
                    </div>
                </div>

            </div>
            <div className='flex gap-4 bg-gray-50 my-2 px-2 pt-1 rounded-b-sm'>
                <Image className='max-h-[135px] object-fit' width={145} height={135} src={res.image} alt='product image'></Image>
                <div>
                    <div className=' md:flex md:gap-5 '>   
                        <div className='font-light line-clamp-2 overflow-hidden md:text-lg md:font-medium'>{res.description}</div>
                        <div className='text-xl font-semibold'>{res.price}$</div>
                    </div>
                    <div className='max-h-8 flex gap-2 max-w-30 items-center justify-between border-3 border-amber-300 px-2 rounded-3xl'>
                        <button className='text-xl cursor-pointer'> - </button>
                        <div>1</div>
                        <button className='text-xl cursor-pointer'>+</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}