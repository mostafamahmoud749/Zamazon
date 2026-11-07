'use client';
import Button from '@/components/common/Button';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

function getSearchUrl(query: string, queryString = '') {
  const params = new URLSearchParams(queryString);
  if (query.trim()) params.set('search', query.trim());
  else params.delete('search');
  params.delete('page');

  const nextQuery = params.toString();
  return nextQuery ? `/deals?${nextQuery}` : '/deals';
}

export default function SearchBlock() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDealsPage = pathname === '/deals';
  const urlSearch = isDealsPage ? (searchParams.get('search') ?? '') : '';
  const queryString = searchParams.toString();
  const [query, setQuery] = useState(urlSearch);

  useEffect(() => {
    setQuery(urlSearch);
  }, [pathname, urlSearch]);

  useEffect(() => {
    if (!isDealsPage || query.trim() === urlSearch) return;

    const timeout = setTimeout(() => {
      router.replace(getSearchUrl(query, queryString), { scroll: false });
    }, 500);

    return () => clearTimeout(timeout);
  }, [query, urlSearch, queryString, isDealsPage, router]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isDealsPage && query.trim() === urlSearch) return;

    const url = getSearchUrl(query, isDealsPage ? queryString : '');
    if (isDealsPage) router.replace(url, { scroll: false });
    else router.push(url);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="my-2 flex flex-1 items-center">
      <input
        className="flex-1 cursor-pointer rounded-l-md bg-white p-2 text-black placeholder:text-gray-400"
        type="search"
        placeholder="Search Zamazon"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Button type="submit" className="bg-orange cursor-pointer rounded-r-md p-2 text-black">
        <Search className="stroke-[2.3]" />
      </Button>
    </form>
  );
}
