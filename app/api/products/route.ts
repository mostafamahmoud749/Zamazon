import { NextRequest, NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/fetchProducts';
import { ProductsQuerySchema } from '@/schemas/Product.schema';

export async function GET(request: NextRequest) {
  const result = ProductsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid product filters' }, { status: 400 });
  }

  const query = new URLSearchParams({
    search: result.data.search,
    rating: String(result.data.rating),
    filters: JSON.stringify(result.data.filters),
    page: String(result.data.page),
    cumulative: String(result.data.cumulative),
  });

  try {
    const products = await fetchProducts(
      `${process.env.API_URL}/api/products?${query}`,
      request.signal,
    );
    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: 'Products are temporarily unavailable' }, { status: 502 });
  }
}
