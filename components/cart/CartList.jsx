export default function CartList({totalProductsCount,totalProductsPrice}) {
  return (
    <div className="px-3 md:flex md:flex-row-reverse md:justify-between">
      <div className="flex items-center gap-2 border-b-1 border-b-amber-100 md:my-2 md:justify-end md:border-none">
        <div className="text-xl font-medium">Subtotal ({totalProductsCount} items): </div>
        <div className="text-2xl font-semibold">{totalProductsPrice.toFixed(2)}$</div>
      </div>
      <button className="my-4 block w-full cursor-pointer rounded-3xl bg-amber-300 py-2 md:my-3 md:max-w-fit md:px-3">
        Proceed to checkout
      </button>
    </div>
  );
}
