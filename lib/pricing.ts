import type { Product } from '@/types/product';

type ProductPrice = Pick<Product, 'price' | 'discount'>;
type CartPriceItem = { product: ProductPrice; quantity: number };

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export function formatPrice(amount: number): string {
  return usdFormatter.format(amount);
}

export function getUnitPriceCents(product: ProductPrice): number {
  const priceCents = Math.round(Number(product.price) * 100);
  const discountBasisPoints = Math.round(Number(product.discount ?? 0) * 100);

  return Math.round((priceCents * (10_000 - discountBasisPoints)) / 10_000);
}

export function getCartTotals(items: CartPriceItem[]) {
  let totalProductsCount = 0;
  let totalCents = 0;

  for (const item of items) {
    totalProductsCount += item.quantity;
    totalCents += getUnitPriceCents(item.product) * item.quantity;
  }

  return { totalProductsCount, totalProductsPrice: totalCents / 100 };
}
