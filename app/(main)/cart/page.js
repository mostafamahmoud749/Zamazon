import CartState from "@/app/(main)/cart/CartState"


export default function CartPage() {
  
  return (
    <div className="m-auto mt-4 w-11/12 md:7/8 max-w-6xl">
      <CartState />
      <div className='min-h-24 bg-white mb-5'></div>
      <div className='md:block hidden text-xs'>
        <p>The price and availability of items at Zamazon.com are subject to change. The Cart is a temporary place to store a list of your items and reflects each items most recent price. Shopping Cart</p>
        <p>Do you have a gift card or promotional code? Well ask you to enter your claim code when its time to pay.</p>
      </div>
    </div>
  )
}
