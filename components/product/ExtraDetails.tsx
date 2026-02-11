'use client';
import Button from '@/components/common/Button';
import { useContext, useState, useEffect } from 'react';
import { CartContext } from '@/components/cart/CartProvider';
import type { CartProduct, Product } from '@/types/index';
import Counter from '@/components/common/Counter';

type ExtraDetailsProps = {
  el: Product;
};

type AddState = 'idle' | 'loading';

export default function ExtraDetails({ el }: ExtraDetailsProps) {
  const { addToCart, products, removeFromCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState<boolean>(() => products.some((p) => p.id === el.id));
  const [product, setProduct] = useState<CartProduct | undefined>(undefined);
  const [addState, setAddState] = useState<AddState>('idle');

  async function handleAddToCart(): Promise<void> {
    if (addState !== 'idle') return;
    setAddState('loading');
    addToCart(el);
    window.setTimeout(() => setAddState('idle'), 300);
  }

  useEffect(() => {
    setIsAdded(products.some((p) => p.id === el.id));
    const foundProduct: CartProduct | undefined = products.find((p) => p.id === el.id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [products, el]);

  return (
    <div className="mx-1 my-2">
      <div>{el.price}$</div>
      <p className="line-clamp-2 text-sm font-medium text-gray-700">{el.title}</p>
      <div className="-ml-1 max-w-[100px]">
        {isAdded && product ? (
          <Counter product={product} addToCart={addToCart} removeFromCart={removeFromCart} />
        ) : (
          <Button
            color="bg-yellow-400"
            hoverdColor="hover:bg-amber-400"
            margin=" my-2"
            disabled={addState !== 'idle'}
            onClick={handleAddToCart}
            padding="py-1"
          >
            Add to Cart
          </Button>
        )}
      </div>
    </div>
  );
}
