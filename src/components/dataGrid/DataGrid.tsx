import type { DataGridProps } from "@/types/dataGrid";
import { useState } from "react";
import Spinner from "../shared/Spinner";
import AdvancedFilterPanel from "./AdvancedFilterPannel";
import EmptyState from "./EmptyState";
import GridError from "./GridError";
import GridHeader from "./GridHeader";
import GridTable from "./GridTable";
import PaginationControls from "./PaginationController";
import SearchFilterBar from "./SearchFilterBar";

const DataGrid = <T extends Record<string, unknown>>({
  title = "Manage Data",
  columns,
  data = [],
  loading = false,
  error = null,
  pagination,
  onPageChange,
  onPageSizeChange,
  sortInfo,
  onSort,
  onSearch,
  onFilter,
  onAddNew,
  onEdit,
  onDelete,
  onView,
  addButtonText = "اضافة عنصر",
  entityName = "عنصر",
  pageSizeOptions = [10, 25, 50, 100],
  enableSearch = true,
  enableFilters = true,
}: DataGridProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState<Record<string, unknown>>({});

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch(term);
  };

  const handleApplyFilters = (filters: Record<string, unknown>) => {
    setLocalFilters(filters);
    onFilter(filters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setSearchTerm("");
    onFilter({});
    onSearch("");
  };

  const hasActiveFilters = !!searchTerm || Object.keys(localFilters).length > 0;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Header */}
      <GridHeader
        title={title}
        onAddNew={onAddNew}
        addButtonText={addButtonText}
      />

      {/* Search & Filter Bar */}
      {(enableSearch || enableFilters) && (
        <SearchFilterBar
          onSearch={handleSearch}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          searchPlaceholder={`ابحث عن ${entityName}...`}
          searchTerm={searchTerm}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Advanced Filter Panel */}
      {showFilters && enableFilters && (
        <AdvancedFilterPanel
          columns={columns}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          currentFilters={localFilters}
        />
      )}

      {/* Data Grid Content */}
      <div className="relative">
        {loading && <Spinner />}

        {error && <GridError message={error} />}

        {!loading && !error && data.length === 0 && (
          <EmptyState
            hasFilters={hasActiveFilters}
            onClearFilters={handleClearFilters}
            entityName={entityName}
          />
        )}

        {!loading && !error && data.length > 0 && (
          <GridTable<T>
            data={data}
            columns={columns}
            sortInfo={sortInfo}
            onSort={onSort}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        )}
      </div>

      {!loading && !error && data.length > 0 && (
        <PaginationControls
          pagination={pagination}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          pageSizeOptions={pageSizeOptions}
        />
      )}
    </div>
  );
};

export default DataGrid;






// import type { DataGridProps } from "@/types/dataGrid";
// import { useState } from "react";
// import Spinner from "../shared/Spinner";
// import AdvancedFilterPanel from "./AdvancedFilterPannel";
// import EmptyState from "./EmptyState";
// import GridError from "./GridError";
// import GridHeader from "./GridHeader";
// import GridTable from "./GridTable";
// import PaginationControls from "./PaginationController";
// import SearchFilterBar from "./SearchFilterBar";

// const DataGrid = <T extends Record<string, unknown>>({
//   title = "Manage Data",
//   columns,
//   data = [],
//   loading = false,
//   error = null,
//   pagination,
//   onPageChange,
//   onPageSizeChange,
//   sortInfo,
//   onSort,
//   onSearch,
//   onFilter,
//   onAddNew,
//   onEdit,
//   onDelete,
//   onView,
//   addButtonText = "اضافة عنصر",
//   entityName = "عنصر",
//   pageSizeOptions = [10, 25, 50, 100],
//   enableSearch = true,
//   enableFilters = true,
// }: DataGridProps<T>) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showFilters, setShowFilters] = useState(false);
//   const [localFilters, setLocalFilters] = useState<Record<string, unknown>>({});

//   const handleSearch = (term: string) => {
//     setSearchTerm(term);
//     onSearch(term);
//   };

//   const handleApplyFilters = (filters: Record<string, unknown>) => {
//     setLocalFilters(filters);
//     onFilter(filters);
//     setShowFilters(false);
//   };

//   const handleClearFilters = () => {
//     setLocalFilters({});
//     setSearchTerm("");
//     onFilter({});
//     onSearch("");
//   };

//   const hasActiveFilters = !!searchTerm || Object.keys(localFilters).length > 0;

//   return (
//     <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
//       {/* Header */}
//       <GridHeader
//         title={title}
//         onAddNew={onAddNew}
//         addButtonText={addButtonText}
//       />

//       {/* Search & Filter Bar */}
//       {(enableSearch || enableFilters) && (
//         <SearchFilterBar
//           onSearch={handleSearch}
//           showFilters={showFilters}
//           setShowFilters={setShowFilters}
//           searchPlaceholder={`ابحث عن ${entityName}...`}
//           searchTerm={searchTerm}
//           hasActiveFilters={hasActiveFilters}
//           onClearFilters={handleClearFilters}
//         />
//       )}

//       {/* Advanced Filter Panel */}
//       {showFilters && enableFilters && (
//         <AdvancedFilterPanel
//           columns={columns}
//           onApplyFilters={handleApplyFilters}
//           onClearFilters={handleClearFilters}
//           currentFilters={localFilters}
//         />
//       )}

//       {/* Data Grid Content */}
//       <div className="relative">
//         {loading && <Spinner />}

//         {error && <GridError message={error} />}

//         {!loading && !error && data.length === 0 && (
//           <EmptyState
//             hasFilters={hasActiveFilters}
//             onClearFilters={handleClearFilters}
//             entityName={entityName}
//           />
//         )}

//         {!loading && !error && data.length > 0 && (
//           <GridTable<T>
//             data={data}
//             columns={columns}
//             sortInfo={sortInfo}
//             onSort={onSort}
//             onEdit={onEdit}
//             onDelete={onDelete}
//             onView={onView}
//           />
//         )}
//       </div>

//       {!loading && !error && data.length > 0 && (
//         <PaginationControls
//           pagination={pagination}
//           onPageChange={onPageChange}
//           onPageSizeChange={onPageSizeChange}
//           pageSizeOptions={pageSizeOptions}
//         />
//       )}
//     </div>
//   );
// };

// export default DataGrid;
