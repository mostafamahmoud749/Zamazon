"use client"
import { useState,useEffect } from "react"
import { Search } from "lucide-react";

export default function SearchBlock() {
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
  }, [query]);

  return (
    <div className="flex items-center my-2 flex-1 ">
      <input
        className="flex-1 bg-white text-black  placeholder:text-gray-400 p-2 rounded-l-md"
        type="search"
        placeholder="Search Zamazon"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div className="bg-orange text-black rounded-r-md p-2 ">
        <Search className="stroke-[2.3]" />
      </div>
    </div>
  );
}
