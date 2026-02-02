'use client';
import CartItem from '@/components/cart/CartItem';
import CartList from '@/components/cart/CartList';
import { useContext } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import {JSX} from "react"

export default function FilledCart():JSX.Element {
    const {products,totalProductsCount,totalProductsPrice}=useContext(CartContext)
    const showProducts:JSX.Element[]|null=products && products.length > 0 ? (
        products.map(product => <CartItem key={product.id} product={product} />)
    ) : null
    return (
        <div className="mb-5 bg-white py-2 md:flex md:flex-col-reverse md:px-5 md:pt-3">
            <CartList totalProductsCount={totalProductsCount} totalProductsPrice={totalProductsPrice}/>
            <hr className="border-amber-300 md:mx-3 md:mt-3 md:border-gray-300 " />
            <div className="my-2 px-3">
                <div className="hidden md:block md:text-3xl">Shopping Cart</div>
                <div className="hidden md:flex md:border-b-gray-100 md:border-b-2">
                    <div className="ml-auto text-sm text-gray-600">price</div>
                </div>
                {showProducts}
            </div>
        </div>
    );
}