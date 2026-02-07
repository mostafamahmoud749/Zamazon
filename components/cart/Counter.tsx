import type { CartProduct } from "@/types/index"

type CounterProps={
    product:CartProduct
    removeFromCart:(Product:CartProduct)=>void
    addToCart:(Product:CartProduct)=>void
}

export default function Counter({product,removeFromCart,addToCart}:CounterProps) {
    return(
        <div className="flex w-full text-xs font-bold  max-h-8 max-w-30 items-center justify-between gap-2 rounded-3xl border-3 border-amber-300 px-2 md:mt-2">
          <button className="cursor-pointer text-xl" onClick={()=>removeFromCart(product)}> - </button>
          <div>{product.count}</div>
          <button className="cursor-pointer text-xl" onClick={()=>addToCart(product)}>+</button>
        </div>
    )
}