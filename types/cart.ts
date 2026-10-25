import type { Product } from './product';

export type CartProduct = {
  id?: number;
  product: Product;
  quantity: number;
};
export type CartContextValue = {
  products: CartProduct[];
  totalProductsCount: number;
  totalProductsPrice: number;
  addToCart: (product: Product, quantity: number) => Promise<void>;
  updateCartItemQuantity: (cartID: number, quantity: number) => Promise<void>;
  removeFromCart: (cartID: number) => Promise<void>;
};
