import CartState from '@/components/cart/CartState';

export default function CartPage() {
  return (
    <div className="md:7/8 m-auto mt-4 w-11/12 max-w-6xl">
      <CartState />
      <div className="mb-5 min-h-24 bg-white"></div>
      <div className="hidden text-xs md:block">
        <p>
          The price and availability of items at Zamazon.com are subject to change. The Cart is a
          temporary place to store a list of your items and reflects each items most recent price.
          Shopping Cart
        </p>
        <p>
          Do you have a gift card or promotional code? Well ask you to enter your claim code when
          its time to pay.
        </p>
      </div>
    </div>
  );
}
