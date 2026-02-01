import type { Product } from './product';

export type CartProduct = Product & {
  count: number;
};

export type CartContextValue = {
  products: CartProduct[];
  totalProductsCount: number;
  totalProductsPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
};
