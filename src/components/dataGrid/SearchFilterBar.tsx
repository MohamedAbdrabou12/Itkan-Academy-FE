interface SearchFilterBarProps {
  onSearch: (term: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  searchPlaceholder: string;
  searchTerm: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
}

const SearchFilterBar = ({
  onSearch,
  showFilters,
  setShowFilters,
  searchPlaceholder,
  searchTerm,
  hasActiveFilters,
  onClearFilters,
}: SearchFilterBarProps) => (
  <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
    <div className="flex items-center space-x-4">
      <div className="max-w-md flex-1">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 rounded-lg border px-4 py-2 font-medium transition-colors ${
            hasActiveFilters
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
              !
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
          >
            Clear All
          </button>
        )}
      </div>
    </div>
  </div>
);

export default SearchFilterBar;

