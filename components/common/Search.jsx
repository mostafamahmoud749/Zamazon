import { Search } from "lucide-react";

export default function SearchBlock() {
  return (
    <div className="flex items-center my-2 flex-1 ">
      <input
        className="flex-1 bg-white text-black  placeholder:text-gray-400 p-2 rounded-l-md"
        type="search"
        placeholder="Search Zamazon"
      />
      <div className="bg-orange text-black rounded-r-md p-2 ">
        <Search className="stroke-[2.3]" />
      </div>
    </div>
  );
}
