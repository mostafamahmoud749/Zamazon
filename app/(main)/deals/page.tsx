import MainDeals from '@/components/deals/MainDeals';
import { fetchCategories } from '@/lib/fetchCategories';
import { fetchProducts } from '@/lib/fetchProducts';
import { ProductsQuerySchema } from '@/schemas/Product.schema';
import Link from 'next/link';

type DealsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const params = await searchParams;
  const result = ProductsQuerySchema.safeParse({
    search: params.search,
    rating: params.rating,
    filters: params.filters,
    page: params.page,
  });

  if (!result.success) {
    return (
      <div className="mx-auto w-4/5 py-8">
        <p>These product filters are invalid.</p>
        <Link href="/deals" className="text-sky-800 underline">
          Reset filters
        </Link>
      </div>
    );
  }

  const query = new URLSearchParams({
    search: result.data.search,
    rating: String(result.data.rating),
    filters: JSON.stringify(result.data.filters),
    page: String(result.data.page),
  });
  const [products, categories] = await Promise.all([
    fetchProducts(`${process.env.API_URL}/api/products?${query}&cumulative=true`),
    fetchCategories(`${process.env.API_URL}/api/categories`),
  ]);

  return <MainDeals key={query.toString()} products={products} categories={categories} />;
}
