import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { BranchFormModal } from "@/components/modals/BranchFormModal";
import { useCreateBranch } from "@/hooks/branches/useCreateBranch";
import { useDeleteBranch } from "@/hooks/branches/useDeleteBranch";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useUpdateBranch } from "@/hooks/branches/useUpdateBranch";
import type { Column } from "@/types/dataGrid";
import type { BranchDetails } from "@/types/Branches";
import { formatDate } from "@/utils/formatDate";
import type { BranchFormData } from "@/validation/branchSchema";
import { useState } from "react";

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];

const BranchesGridPage = () => {
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
    page_size: pagination.pageSize,
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

  const handleFilter = (filters: Record<string, unknown>) => {
    // If you want to implement filters later, add them here
    console.log("Filters applied:", filters);
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

  const handleDelete = (branch: BranchDetails) => {
    setDeletingBranch(branch);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingBranch) {
      await deleteMutation.mutateAsync(deletingBranch.id);
      setIsDeleteModalOpen(false);
      setDeletingBranch(null);
      refetch();
    }
  };

  const handleView = (branch: BranchDetails) => {
    console.log("View branch:", branch);
    // Implement view branch functionality
  };

  // Define columns for the DataGrid
  const columns: Column<BranchDetails>[] = [
    { key: "id", title: "ID", sortable: true },
    {
      key: "name",
      title: "Name",
      sortable: true,
    },
    {
      key: "email",
      title: "Email",
      sortable: true,
    },
    {
      key: "phone",
      title: "Phone",
      sortable: true,
      render: (value: unknown) => (
        <span dir="ltr" className="text-left">
          {String(value)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      sortable: true,
      render: (value: unknown) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {String(value).charAt(0).toUpperCase() + String(value).slice(1)}
        </span>
      ),
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
        onFilter={handleFilter}
        onAddNew={handleAddNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        addButtonText="اضافة فرع"
        entityName="فرع"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={false} // Set to true if you implement filters
      />

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
            : undefined
        }
        isSubmitting={isSubmitting}
        isEditing={!!editingBranch}
      />

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
    </div>
  );
};

export default BranchesGridPage;
