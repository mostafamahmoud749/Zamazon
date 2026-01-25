"use client"
import Button from '@/components/deal/Button';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';

export default function Buy({ product }) {
  const {addToCart}=useContext(CartContext)
  
  return (
    <div className="mt-4">
      <div className="mb-2 text-3xl font-bold ">{product.price}$</div>
      <div className="my-4 ">
        <Button text="Add to Cart" color="bg-yellow-400" addToCart={addToCart} product={product} />
        <Button text="Buy Now" color="bg-orange-400" />
      </div>
      <div className="border-t border-gray-300 pt-4">
        <h2 className="mb-2 text-lg font-semibold text-gray-800">Product Details</h2>
        <div className="text-sm text-gray-600">{product.description}</div>
      </div>
    </div>
  );
}
