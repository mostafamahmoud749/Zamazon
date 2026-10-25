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
  addToCart: async (product: Product, quantity: number) => {},
  updateCartItemQuantity: async (cartID: number, quantity: number) => {},
  removeFromCart: async (cartID: number) => {},
};

const CartContext = createContext<CartContextValue>(defaultCartContextValue);

export function CartProvider({ children }: { children: ReactNode }) {
  // still need to add merge carts 
  const { status } = useContext(UserContext);
  const [products, setProducts] = useState<CartProduct[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  async function addToCart(product: Product, quantity: number) {
    const productId = product.id;

    if (status === 'authenticated') {
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

        setProducts((prev) => {
          const exists = prev.some((item) => item.product.id === data.product.id);

          return exists
            ? prev.map((item) => (item.product.id === data.product.id ? data : item))
            : [...prev, data];
        });
      } catch (error) {
        console.error('Error during adding product to the cart:', error);
      }
    } else if (status == 'unauthenticated') {
      setProducts((prev) => {
        const exists = prev.some((item) => item.product.id === product.id);

        return exists
          ? prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            )
          : [...prev, { product, quantity }];
      });
    }
  }

  async function updateCartItemQuantity(cartID: number, quantity: number) {
    if (status === 'authenticated') {
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

        setProducts((prev) => prev.map((item) => (item.id === cartID ? data : item)));
      } catch (error) {
        console.error('Error updating cart item quantity:', error);
      }
    } else if (status === 'unauthenticated') {
      setProducts((prev) =>
        prev.map((item) => (item.product.id === cartID ? { ...item, quantity } : item)),
      );
    }
  }

  async function removeFromCart(cartID: number) {
    if (status === 'authenticated') {
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

        setProducts((prev) => prev.filter((item) => item.id !== cartID));
      } catch (error) {
        console.error('Error during deleting cart item:', error);
      }
    } else if (status === 'unauthenticated') {
      setProducts((prev) => prev.filter((item) => item.product.id !== cartID));
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
    if (status !== 'unauthenticated') {
      setIsInitialized(false);

      if (status === 'authenticated') {
        void fetchCart();
      }

      return;
    }

    try {
      const saved = localStorage.getItem('cart');
      const parsed: unknown = saved ? JSON.parse(saved) : [];

      setProducts(Array.isArray(parsed) ? (parsed as CartProduct[]) : []);
    } catch {
      setProducts([]);
    } finally {
      setIsInitialized(true);
    }
  }, [status, fetchCart]);

  const { totalProductsCount, totalProductsPrice } = useMemo(() => {
    return products.reduce(
      (acc: { totalProductsCount: number; totalProductsPrice: number }, product: CartProduct) => {
        acc.totalProductsCount += product.quantity;
        acc.totalProductsPrice += product.quantity * Number(product.product.price);
        return acc;
      },
      { totalProductsCount: 0, totalProductsPrice: 0 },
    );
  }, [products]);

  useEffect(() => {
    if (!isInitialized || status !== 'unauthenticated') return;

    try {
      localStorage.setItem('cart', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving guest cart:', error);
    }
  }, [isInitialized, products, status]);

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
