import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { RoleFormModal } from "@/components/modals/RoleFormModal";
import RolePermissionsModal from "@/components/modals/RolePermissionsModal";
import { useCreateRole } from "@/hooks/roles/useCreateRole";
import { useDeleteRole } from "@/hooks/roles/useDeleteRole";
import { useGetRoles } from "@/hooks/roles/useGetRoles";
import { useUpdateRole } from "@/hooks/roles/useUpdateRole";
import type { Column } from "@/types/dataGrid";
import type { RoleDetails } from "@/types/Roles";
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
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleDetails | null>(null);
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
    size: pagination.pageSize,
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

  const handleAddNew = () => {
    setEditingRole(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (role: RoleDetails) => {
    setEditingRole(role);
    setIsFormModalOpen(true);
  };

  const handleManagePermissions = (role: RoleDetails) => {
    setSelectedRole(role);
    setIsPermissionsModalOpen(true);
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
    }
  };

  // Define columns for the DataGrid
  const columns: Column<RoleDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "الاسم بالانجليزية",
      sortable: true,
    },
    { key: "name_ar", title: "الاسم بالعربية", sortable: true },
    {
      key: "description_ar",
      title: "الوصف بالعربية",
      sortable: true,
    },
    {
      key: "permissions_count",
      title: "الصلاحيات",
      sortable: false,
      render: (value: unknown, row: RoleDetails) => (
        <div className="text-cneter flex justify-center gap-2">
          <span>{(value as number) || 0} صلاحيات</span>
          <button
            onClick={() => handleManagePermissions(row)}
            className="cursor-pointer text-sm font-medium text-emerald-600 hover:text-emerald-800"
          >
            إدارة
          </button>
        </div>
      ),
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
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        addButtonText="اضافة وظيفة"
        entityName="وظيفة"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={false}
      />

      {/* Role Form Modal */}
      {isFormModalOpen && (
        <RoleFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={
            editingRole
              ? {
                  name: editingRole.name,
                  name_ar: editingRole.name_ar,
                  description: editingRole.description,
                  description_ar: editingRole.description_ar,
                }
              : undefined
          }
          isSubmitting={isSubmitting}
          isEditing={!!editingRole}
        />
      )}

      {/* Permissions Modal */}
      {isPermissionsModalOpen && selectedRole && (
        <RolePermissionsModal
          isOpen={isPermissionsModalOpen}
          onClose={() => {
            setIsPermissionsModalOpen(false);
            setEditingRole(null);
          }}
          role={selectedRole}
          onPermissionsUpdated={refetch}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingRole(null);
          }}
          onConfirm={handleConfirmDelete}
          title="حذف الوظيفة"
          description="هل أنت متأكد من أنك تريد حذف هذا الوظيفة؟ لا يمكن التراجع عن هذا الإجراء."
          itemName={deletingRole?.name_ar}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default RolesGridPage;
