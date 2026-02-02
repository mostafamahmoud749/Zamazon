import Button from '@/components/common/Button';
import {JSX} from "react"

type CartList={
  totalProductsCount:number
  totalProductsPrice:number
}

export default function CartList({ totalProductsCount, totalProductsPrice }:CartList):JSX.Element {
  return (
    <div className="px-3 md:flex md:flex-row-reverse md:justify-between">
      <div className="flex items-center gap-2 border-b-1 border-b-amber-100 md:my-2 md:justify-end md:border-none">
        <div className="text-xl font-medium">Subtotal ({totalProductsCount} items): </div>
        <div className="text-2xl font-semibold">{totalProductsPrice.toFixed(2)}$</div>
      </div>
      <Button
        color="bg-amber-300"
        hoverdColor="hover:bg-amber-400"
        margin="my-4 md:my-3"
        padding="py-2 md:px-3"
        extraStyling="w-full md:max-w-fit"
      >
        Proceed to checkout
      </Button>
    </div>
  );
}
