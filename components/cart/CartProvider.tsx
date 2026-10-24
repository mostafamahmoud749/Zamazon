'use client';
import { createContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartContextValue, CartProduct, Product } from '@/types';
import { getCsrfToken } from '@/lib/getCsrfToken';

const defaultCartContextValue: CartContextValue = {
  products: [],
  totalProductsCount: 0,
  totalProductsPrice: 0,
  addToCart: () => {},
  removeFromCart: () => {},
};

const CartContext = createContext<CartContextValue>(defaultCartContextValue);

export function CartProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  async function addToCart(productId: number, quantity: number) {
    const csrfToken = await getCsrfToken();
    try {
      let result = await fetch(`${process.env.API_URL}/api/cart/items`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error);
      }

      setProducts((prev) => [...prev, data]);
    } catch (error) {
      console.error('Error during adding product to the cart:', error);
    }
  }

  function removeFromCart(product: Product) {
    setProducts((prev) =>
      prev.flatMap((p: CartProduct): CartProduct[] => {
        if (p.id !== product.id) return [p];
        if (p.count > 1) return [{ ...p, count: p.count - 1 }];
        return [];
      }),
    );
  }

  useEffect(() => {
    try {
      const saved: string | null = localStorage.getItem('cart');
      if (!saved) return;

      const parsed: unknown = JSON.parse(saved);
      if (Array.isArray(parsed)) setProducts(parsed as CartProduct[]);
    } catch {
      // Ignore invalid stored cart data.
    } finally {
      setIsInitialized(true);
    }
  }, []);

  const { totalProductsCount, totalProductsPrice } = useMemo(() => {
    return products.reduce(
      (acc: { totalProductsCount: number; totalProductsPrice: number }, product: CartProduct) => {
        acc.totalProductsCount += product.count;
        acc.totalProductsPrice += product.count * Number(product.price);
        return acc;
      },
      { totalProductsCount: 0, totalProductsPrice: 0 },
    );
  }, [products]);

  useEffect(() => {
    if (!isInitialized) return;
    localStorage.setItem('cart', JSON.stringify(products));
  }, [isInitialized, products]);

  return (
    <CartContext.Provider
      value={{ products, addToCart, removeFromCart, totalProductsCount, totalProductsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
