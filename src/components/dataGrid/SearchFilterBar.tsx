import { Search } from "lucide-react";

interface SearchFilterBarProps {
  onSearch: (term: string) => void;
  searchPlaceholder: string;
  searchTerm: string;
}

const SearchFilterBar = ({
  onSearch,
  searchPlaceholder,
  searchTerm,
}: SearchFilterBarProps) => (
  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
    <div className="flex items-center space-x-4">
      <div className="max-w-md flex-1">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>
    </div>
  </div>
);

export default SearchFilterBar;
