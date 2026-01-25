'use client';
import { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [totalProductsCount, setTotalProductsCount] = useState(0)
  const [totalProductsPrice, setTotalProductsPrice] = useState(0)
  const [products, setProducts] = useState([]);
  
  function addToCart(product) {
    if (products.some((p) => p.id === product.id)) {
      setProducts((prev) =>
        prev.map((p) => {
          if (p.id === product.id) return { ...p, count: p.count + 1 };
          return p;
        }),
      );
    } else {
      setProducts((prev) => [...prev, { ...product, count: 1 }]);
    }
  }

  function removeFromCart(product) {
    setProducts((prev) =>
      prev.flatMap((p) => {
        if (p.id !== product.id) return [p];
        if (p.count > 1) return [{ ...p, count: p.count - 1 }];
        return [];
      }),
    );
  }



  useEffect(() => {
    const { count, price } = products.reduce(
      (acc, product) => {
        acc.count += product.count;
        acc.price += product.count * product.price;
        return acc;
      },
      { count: 0, price: 0 },
    );
    setTotalProductsCount(count);
    setTotalProductsPrice(price);
  }, [products]);
  return (
    <CartContext.Provider
      value={{ products, addToCart, removeFromCart, totalProductsCount, totalProductsPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext };
