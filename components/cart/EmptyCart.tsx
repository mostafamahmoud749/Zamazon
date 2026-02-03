import Image from 'next/image';
import Link from 'next/link';
import Button from "@/components/common/Button"

export default function EmptyCart(){
  return (
    <div className="mb-5 flex min-h-[300px] flex-col items-center bg-white md:flex-row md:gap-4">
      <Image width={400} height={400} src="/pngwing.com.png" alt="cart" />
      <div className="flex-1 text-center md:pr-4 md:text-start">
        <div className="mb-1 text-xl font-bold md:text-2xl">Your Zamazon Cart is empty</div>
        <Link
          href={'/deals'}
          className="text-sm text-sky-500 transition-all duration-200 hover:text-sky-600"
        >
          shop todays deals
        </Link>
        <div className="my-5 flex flex-col gap-2 md:flex-row md:flex-wrap">
          <Link
            href={'/sign?s=signin'}
            className="md:text-md block w-full text-sm md:w-fit md:py-1"
          >
            <Button color="bg-amber-300" hoverdColor="hover:bg-amber-400" padding='p-2 md:py-1'>
              Sign in to your account
            </Button>
          </Link>
          <Link
            href={'/sign?s=signup'}
            className="md:text-md block w-full text-sm md:w-fit "
          >
            <Button color="" hoverdColor="hover:bg-gray-200" padding='p-2 md:py-1' extraStyling="border-1 border-gray-500">
              Sign up now
            </Button>
            
          </Link>
        </div>
      </div>
    </div>
  );
}
