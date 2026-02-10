import type { Product, ProductRating } from '@/types/index';

// DummyJSON raw types
type DummyJsonReview = { rating: number };
type DummyJsonProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  thumbnail: string;
  rating: number;
  reviews?: DummyJsonReview[];
};
type DummyJsonProductList = {
  products: DummyJsonProduct[];
  total: number;
  skip: number;
  limit: number;
};

function adaptProduct(p: DummyJsonProduct): Product {
  const rating: ProductRating = {
    rate: p.rating,
    count: p.reviews?.length ?? 0,
  };
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    rating,
  };
}

export async function fetchProducts<T = unknown>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } }); // cache for 10 minutes
    if (!res.ok) return null;

    const data: unknown = await res.json();

    // DummyJSON list response: { products: [...], total, skip, limit }
    if (data && typeof data === 'object' && 'products' in data) {
      const list = data as DummyJsonProductList;
      return list.products.map(adaptProduct) as T;
    }

    // DummyJSON single product response
    if (data && typeof data === 'object' && 'id' in data && 'thumbnail' in data) {
      return adaptProduct(data as DummyJsonProduct) as T;
    }

    return data as T;
  } catch {
    return null;
  }
}
