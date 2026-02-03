'use client';
import { createContext, useEffect, useMemo, useState } from 'react';
import type {  ReactNode } from 'react';
import type { CartContextValue, CartProduct, Product } from '@/types';

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

  function addToCart(product: Product) {
    setProducts((prev) => {
      if (prev.some((p): boolean => p.id === product.id)) {
        return prev.map((p) => {
          if (p.id === product.id) return { ...p, count: p.count + 1 };
          return p;
        });
      }

      return [...prev, { ...product, count: 1 }];
    });
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
        acc.totalProductsPrice += product.count * product.price;
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
