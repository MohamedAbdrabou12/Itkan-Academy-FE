import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { RoleFormModal } from "@/components/modals/RoleFormModal";
import { useCreateRole } from "@/hooks/roles/useCreateRole";
import { useDeleteRole } from "@/hooks/roles/useDeleteRole";
import { useGetRoles } from "@/hooks/roles/useGetRoles";
import { useUpdateRole } from "@/hooks/roles/useUpdateRole";
import type { Column } from "@/types/dataGrid";
import type { RoleDetails } from "@/types/Roles";
import { formatDate } from "@/utils/formatDate";
import type { RoleFormData } from "@/validation/roleSchema";
import { useState } from "react";

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];

const RolesGridPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "name" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleDetails | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRole, setDeletingRole] = useState<RoleDetails | null>(null);

  // Use the hook with parameters
  const {
    roles,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetRoles({
    page: pagination.page,
    page_size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });
  const createMutation = useCreateRole();
  const updateMutation = useUpdateRole();
  const deleteMutation = useDeleteRole();

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
    setEditingRole(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (role: RoleDetails) => {
    setEditingRole(role);
    setIsFormModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: RoleFormData) => {
    if (editingRole) {
      await updateMutation.mutateAsync({
        id: editingRole.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    refetch(); // Refresh the data
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleDelete = (role: RoleDetails) => {
    setDeletingRole(role);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingRole) {
      await deleteMutation.mutateAsync(deletingRole.id);
      setIsDeleteModalOpen(false);
      setDeletingRole(null);
      refetch();
    }
  };

  const handleView = (role: RoleDetails) => {
    console.log("View role:", role);
    // Implement view role functionality
  };

  // Define columns for the DataGrid
  const columns: Column<RoleDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "الاسم بالانجليزية",
      sortable: true,
    },
    { key: "name_in_arabic", title: "الاسم بالعربية", sortable: true },
    {
      key: "description",
      title: "الوصف",
      sortable: true,
    },
    {
      key: "created_at",
      title: "تاريخ الانشاء",
      sortable: true,
      render: (value: unknown) => formatDate(value),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<RoleDetails>
        title="ادارة الوظائف"
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
        addButtonText="اضافة وظيفة"
        entityName="وظيفة"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={false} // Set to true if you implement filters
      />

      <RoleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={
          editingRole
            ? {
                name: editingRole.name,
                description: editingRole.description,
                name_in_arabic: editingRole.name_in_arabic,
              }
            : undefined
        }
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingRole(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Role"
        description="Are you sure you want to delete this role? This action cannot be undone."
        itemName={deletingRole?.name}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default RolesGridPage;
