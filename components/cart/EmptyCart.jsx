import Image from 'next/image';
import Link from 'next/link';

export default function EmptyCart () {
    return(
      <div className="mb-5 bg-white min-h-[300px] flex-col md:flex-row  flex md:gap-4 items-center">
        <Image width={400} height={400} src="/pngwing.com.png" alt="cart" />
        <div className='flex-1 text-center md:text-start md:pr-4'>
            <div className='md:text-2xl text-xl font-bold mb-1'>Your Zamazon Cart is empty</div>
            <Link href={"/deals"} className='text-sm text-sky-500'>shop todays deals</Link>
            <div className='flex flex-col md:flex-wrap md:flex-row gap-2  my-5'>
                <Link href={"/sign?s=signin"} className='block w-full md:w-fit cursor-pointer text-sm md:text-md py-2 md:py-1 px-2 rounded-3xl bg-amber-300'>Sign in to your account</Link>
                <Link href={"/sign?s=signup"} className='block w-full md:w-fit cursor-pointer text-sm md:text-md py-2 md:py-1 px-2 rounded-3xl border-1 border-gray-500'>Sign up now</Link>
            </div>
        </div>
      </div>
  );
}