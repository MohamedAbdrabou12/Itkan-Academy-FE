import DataGrid from "@/components/dataGrid/DataGrid";
import { BranchFormModal } from "@/components/modals/BranchFormModal";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { useCreateBranch } from "@/hooks/branches/useCreateBranch";
import { useDeleteBranch } from "@/hooks/branches/useDeleteBranch";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useUpdateBranch } from "@/hooks/branches/useUpdateBranch";
import type { BranchDetails } from "@/types/Branches";
import type { Column } from "@/types/dataGrid";
import { PermissionKeys } from "@/constants/Permissions";
import type { BranchFormData } from "@/validation/branchSchema";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const BranchesGridPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDetails | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState<BranchDetails | null>(
    null,
  );

  // Use the hook with parameters (you might need to update your hook to accept params)
  const {
    branches,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllBranches({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();

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
    setEditingBranch(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (branch: BranchDetails) => {
    setEditingBranch(branch);
    setIsFormModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: BranchFormData) => {
    if (editingBranch) {
      await updateMutation.mutateAsync({
        id: editingBranch.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    refetch(); // Refresh the data
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleConfirmDelete = async () => {
    if (deletingBranch) {
      await deleteMutation.mutateAsync(deletingBranch.id);
      setIsDeleteModalOpen(false);
      setDeletingBranch(null);
      refetch();
    }
  };

  // const handleView = (branch: BranchDetails) => {
  //   console.log("View branch:", branch);
  //   // Implement view branch functionality
  // };

  const columns: Column<BranchDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "الاسم",
      sortable: true,
    },
    {
      key: "email",
      title: "البريد الالكتروني",
      sortable: true,
    },
    {
      key: "phone",
      title: "رقم الهاتف",
      sortable: true,
      render: (value: unknown) => (
        <span dir="ltr" className="text-left">
          {String(value)}
        </span>
      ),
    },
    {
      key: "status",
      title: "الحالة",
      sortable: true,
      render: (value: unknown) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === "active" ? "نشط" : "غير نشط"}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<BranchDetails>
        title="ادارة الفروع"
        columns={columns}
        data={branches}
        loading={isPending}
        error={error?.message || null}
        pagination={{
          page: apiPagination?.page || 1,
          pageSize: apiPagination?.pageSize || PAGE_SIZE,
          total: apiPagination?.total || 0,
          totalPages: apiPagination?.totalPages || 0,
        }}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        sortInfo={sortInfo}
        onSort={handleSort}
        onSearch={handleSearch}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        // onView={handleView}
        addButtonText="اضافة فرع"
        entityName="فرع"
        searchPlaceholder="ابحث باسم الفرع..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.SYSTEM_BRANCHES_VIEW}
        addPermission={PermissionKeys.SYSTEM_BRANCHES_ADD}
        editPermission={PermissionKeys.SYSTEM_BRANCHES_EDIT}
      />

      {isFormModalOpen && (
        <BranchFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={
            editingBranch
              ? {
                  name: editingBranch.name,
                  email: editingBranch.email,
                  phone: editingBranch.phone,
                  address: editingBranch.address,
                  status: editingBranch.status,
                }
              : {
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                  status: "active",
                }
          }
          isSubmitting={isSubmitting}
          isEditing={!!editingBranch}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingBranch(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Branch"
          description="Are you sure you want to delete this branch? This action cannot be undone."
          itemName={deletingBranch?.name}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default BranchesGridPage;
