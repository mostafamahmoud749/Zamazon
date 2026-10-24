import type { Product } from './product';

export type CartProduct = Product & {
  count: number;
};

export type CartContextValue = {
  products: CartProduct[];
  totalProductsCount: number;
  totalProductsPrice: number;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItemQuantity: (cartID: number, quantity: number) => Promise<void>;
  removeFromCart: (cartID: number) => Promise<void>;
};
