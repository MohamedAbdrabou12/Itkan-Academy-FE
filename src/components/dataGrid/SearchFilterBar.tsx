import { Funnel, Search } from "lucide-react";

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
            <Search size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 rounded-lg border px-4 py-2 font-medium transition-colors ${
            hasActiveFilters
              ? "border-emerald-500 bg-emerald-50 text-emerald-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Funnel size={20} />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs text-white">
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













// import { Funnel, Search } from "lucide-react";

// interface SearchFilterBarProps {
//   onSearch: (term: string) => void;
//   showFilters: boolean;
//   setShowFilters: (show: boolean) => void;
//   searchPlaceholder: string;
//   searchTerm: string;
//   hasActiveFilters: boolean;
//   onClearFilters: () => void;
// }

// const SearchFilterBar = ({
//   onSearch,
//   showFilters,
//   setShowFilters,
//   searchPlaceholder,
//   searchTerm,
//   hasActiveFilters,
//   onClearFilters,
// }: SearchFilterBarProps) => (
//   <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
//     <div className="flex items-center space-x-4">
//       <div className="max-w-md flex-1">
//         <div className="relative">
//           <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//             <Search size={20}/>
//           </div>
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => onSearch(e.target.value)}
//             placeholder={searchPlaceholder}
//             className="block w-full rounded-lg border border-gray-300 bg-white py-2 pr-3 pl-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       <div className="flex items-center space-x-2">
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className={`flex items-center space-x-2 rounded-lg border px-4 py-2 font-medium transition-colors ${
//             hasActiveFilters
//               ? "border-blue-500 bg-blue-50 text-blue-700"
//               : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//           }`}
//         >
//           <Funnel size={20}/>
//           <span>Filters</span>
//           {hasActiveFilters && (
//             <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
//               !
//             </span>
//           )}
//         </button>

//         {hasActiveFilters && (
//           <button
//             onClick={onClearFilters}
//             className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
//           >
//             Clear All
//           </button>
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default SearchFilterBar;
