import type { DataGridProps, FilterValue } from "@/types/dataGrid";
import { useState } from "react";
import PermissionGate from "../auth/PermissionGate";
import Spinner from "../shared/Spinner";
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
  onAddNew,
  onEdit,
  onDelete,
  onView,
  searchPlaceholder,
  viewPermission,
  addPermission,
  editPermission,
  deletePermission,
  addButtonText = "اضافة عنصر",
  entityName = "عنصر",
  pageSizeOptions = [10, 25, 50, 100],
  enableSearch = true,
  enableFilters = true,
}: DataGridProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [localFilters, setLocalFilters] = useState<Record<string, FilterValue>>(
    {}
  );

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    setSearchTerm("");
    onSearch?.("");
  };

  const hasActiveFilters = Boolean(searchTerm) || Object.keys(localFilters).length > 0;

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white shadow-sm">
      <GridHeader
        title={title}
        onAddNew={onAddNew}
        addButtonText={addButtonText}
        addPermission={addPermission}
      />

      <PermissionGate permission={viewPermission ?? ""}>
        {(enableSearch || enableFilters) && (
          <SearchFilterBar
            onSearch={handleSearch}
            searchPlaceholder={searchPlaceholder}
            searchTerm={searchTerm}
          />
        )}

        <div className="px-2 sm:px-3">
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
              editPermission={editPermission}
              deletePermission={deletePermission}
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
      </PermissionGate>
    </div>
  );
};

export default DataGrid;