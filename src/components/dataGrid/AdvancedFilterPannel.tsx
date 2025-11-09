import type { AdvancedFilterPanelProps, FilterValue } from "@/types/dataGrid";
import { useState, useEffect } from "react";

const AdvancedFilterPanel = <T extends Record<string, unknown>>({
  columns,
  onApplyFilters,
  onClearFilters,
  currentFilters,
}: AdvancedFilterPanelProps<T>) => {
  const [localFilters, setLocalFilters] = useState<Record<string, FilterValue>>({});

  useEffect(() => {
    setLocalFilters({ ...currentFilters } as Record<string, FilterValue>);
  }, [currentFilters]);

  const handleFilterChange = (key: string, value: FilterValue) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApplyFilters(localFilters);
  };

  const handleClear = () => {
    setLocalFilters({});
    onClearFilters();
  };

  return (
    <div className="mt-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-md">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {columns
          .filter((col) => col.key !== "actions")
          .map((column) => (
            <div key={column.key as string}>
              <label className="mb-1 block text-sm font-medium text-gray-800">
                {column.title}
              </label>
              <input
                type="text"
                value={(localFilters[column.key as string] as string) || ""}
                onChange={(e) =>
                  handleFilterChange(column.key as string, e.target.value)
                }
                placeholder={`Filter by ${column.title.toLowerCase()}...`}
                className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          ))}
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={handleClear}
          className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Clear
        </button>
        <button
          onClick={handleApply}
          className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default AdvancedFilterPanel;





// import type { AdvancedFilterPanelProps, FilterValue } from "@/types/dataGrid";
// import { useState } from "react";

// const AdvancedFilterPanel = <T extends Record<string, unknown>>({
//   columns,
//   onApplyFilters,
//   onClearFilters,
//   currentFilters,
// }: AdvancedFilterPanelProps<T>) => {
//   const [localFilters, setLocalFilters] =
//     useState<Record<string, FilterValue>>(currentFilters);

//   const handleFilterChange = (key: string, value: FilterValue) => {
//     setLocalFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleApply = () => {
//     onApplyFilters(localFilters);
//   };

//   const handleClear = () => {
//     setLocalFilters({});
//     onClearFilters();
//   };

//   return (
//     <div className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
//         {columns
//           .filter((col) => col.key !== "actions")
//           .map((column) => (
//             <div key={column.key as string}>
//               <label className="mb-1 block text-sm font-medium text-gray-700">
//                 {column.title}
//               </label>
//               <input
//                 type="text"
//                 value={(localFilters[column.key as string] as string) || ""}
//                 onChange={(e) =>
//                   handleFilterChange(column.key as string, e.target.value)
//                 }
//                 placeholder={`Filter by ${column.title.toLowerCase()}...`}
//                 className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           ))}
//       </div>

//       <div className="mt-4 flex justify-end space-x-3">
//         <button
//           onClick={handleClear}
//           className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
//         >
//           Clear
//         </button>
//         <button
//           onClick={handleApply}
//           className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
//         >
//           Apply Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdvancedFilterPanel;
