import { useState } from "react";
import DataGrid from "@/components/dataGrid/DataGrid";
import { useGetRoles } from "@/hooks/roles/useGetRoles";
import type { RoleDetails } from "@/types/Roles";
import { formatDate } from "@/utils/formatDate";
import type { Column } from "@/types/dataGrid";

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];

const RolesGridPage = () => {
  // State for pagination, sorting, and search
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const [sortInfo, setSortInfo] = useState({
    sortBy: "name" as string,
    sortOrder: "asc" as "asc" | "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Use the hook with parameters
  const {
    roles,
    pagination: apiPagination,
    isPending,
    error,
  } = useGetRoles({
    page: pagination.page,
    page_size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  // Event handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      pageSize,
      page: 1, // Reset to first page when changing page size
    }));
  };

  const handleSort = (sortBy: string) => {
    setSortInfo((prev) => ({
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
  };

  const handleFilter = (filters: Record<string, unknown>) => {
    // If you want to implement filters later, add them here
    console.log("Filters applied:", filters);
  };

  const handleAddNew = () => {
    console.log("Add new role clicked");
    // Implement add new role functionality
  };

  const handleEdit = (role: RoleDetails) => {
    console.log("Edit role:", role);
    // Implement edit role functionality
  };

  const handleDelete = (role: RoleDetails) => {
    console.log("Delete role:", role);
    if (confirm(`Are you sure you want to delete ${role.name}?`)) {
      // Implement delete role functionality
    }
  };

  const handleView = (role: RoleDetails) => {
    console.log("View role:", role);
    // Implement view role functionality
  };

  // Define columns for the DataGrid
  const columns: Column<RoleDetails>[] = [
    { key: "id", title: "ID", sortable: true },
    {
      key: "name",
      title: "Name",
      sortable: true,
    },
    { key: "name_in_arabic", title: "Name in Arabic", sortable: true },
    {
      key: "description",
      title: "Description",
      sortable: true,
    },
    {
      key: "created_at",
      title: "Created At",
      sortable: true,
      render: (value: unknown) => formatDate(value),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<RoleDetails>
        title="Manage Roles"
        columns={columns}
        data={roles}
        loading={isPending}
        error={error?.message || null}
        pagination={{
          page: apiPagination.page,
          pageSize: apiPagination.pageSize,
          total: apiPagination.total,
          totalPages: apiPagination.totalPages,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sortInfo={sortInfo}
        onSort={handleSort}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        addButtonText="Add Role"
        entityName="roles"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={false} // Set to true if you implement filters
      />
    </div>
  );
};

export default RolesGridPage;
