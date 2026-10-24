'use client';
import { createContext, useEffect, useContext, useCallback, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { CartContextValue, CartProduct, Product } from '@/types';
import { getCsrfToken } from '@/lib/getCsrfToken';
import { UserContext } from '../auth/UserProvider';

const defaultCartContextValue: CartContextValue = {
  products: [],
  totalProductsCount: 0,
  totalProductsPrice: 0,
  addToCart: async (productId: number, quantity: number) => {},
  updateCartItemQuantity: async (cartID: number, quantity: number) => {},
  removeFromCart: async (cartID: number) => {},
};

const CartContext = createContext<CartContextValue>(defaultCartContextValue);

export function CartProvider({ children }: { children: ReactNode }) {
  const { status } = useContext(UserContext);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  async function addToCart(productId: number, quantity: number) {
    try {
      const csrfToken = await getCsrfToken();
      const result = await fetch(`${process.env.API_URL}/api/cart/items`, {
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

  async function updateCartItemQuantity(cartID: number, quantity: number) {
    try {
      const csrfToken = await getCsrfToken();
      const result = await fetch(`${process.env.API_URL}/api/cart/items/${cartID}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error);
      }

      setProducts((prev) => prev.map((el) => (el.id === cartID ? { ...el, quantity } : el)));
    } catch (error) {
      console.error('Error updating cart item quantity:', error);
    }
  }

  async function removeFromCart(cartID: number) {
    try {
      const csrfToken = await getCsrfToken();
      const result = await fetch(`${process.env.API_URL}/api/cart/items/${cartID}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': csrfToken,
        },
      });

      if (!result.ok) {
        const data = await result.json();
        throw new Error(data.error);
      }

      setProducts((prev) => prev.filter((el) => el.id !== cartID));
    } catch (error) {
      console.error('Error during deleting cart item:', error);
    }
  }

  const fetchCart = useCallback(async () => {
    try {
      const result = await fetch(`${process.env.API_URL}/api/cart/items`, {
        credentials: 'include',
        cache: 'no-store',
      });

      const data = await result.json();

      if (!result.ok) {
        throw new Error(data.error || 'Failed to fetch cart');
      }

      setProducts(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      void fetchCart();
    }
  }, [status, fetchCart]);

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
      value={{
        products,
        addToCart,
        updateCartItemQuantity,
        removeFromCart,
        totalProductsCount,
        totalProductsPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
