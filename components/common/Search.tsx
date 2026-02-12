'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

export default function SearchBlock() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<string>(searchParams.get('search') ?? '');

  useEffect(() => {
    const urlSearch = searchParams.get('search') ?? '';
    if (urlSearch !== query) {
      setQuery(urlSearch);
    }
  }, [searchParams]);

  // Sync state → URL: update URL when user types
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('search', query);
    } else {
      params.delete('search');
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [query, router, pathname]);

  return (
    <div className="my-2 flex flex-1 items-center">
      <input
        className="flex-1 rounded-l-md bg-white cursor-pointer p-2 text-black placeholder:text-gray-400"
        type="search"
        placeholder="Search Zamazon"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="bg-orange rounded-r-md p-2 text-black">
        <Search className="stroke-[2.3]" />
      </div>
    </div>
  );
}
