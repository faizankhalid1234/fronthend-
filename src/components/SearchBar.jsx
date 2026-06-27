import { IoSearchOutline } from "react-icons/io5";

function SearchBar({ className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <IoSearchOutline className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-muted" />
      <input
        type="search"
        placeholder="Search"
        className="h-[44px] w-full rounded-full border border-transparent bg-gray-input pl-10 pr-4 text-sm font-medium text-navy placeholder:text-gray-muted outline-none transition focus:border-orange/30 focus:bg-white focus:ring-2 focus:ring-orange/15 md:w-[260px]"
      />
    </div>
  );
}

export default SearchBar;
