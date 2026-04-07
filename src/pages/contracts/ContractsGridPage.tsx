import DataGrid from "@/components/dataGrid/DataGrid";
import ContractFormModal from "@/components/modals/ContractFormModal";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { PermissionKeys } from "@/constants/permissions";
import { useCreateContract } from "@/hooks/contracts/useCreateContract";
import { useDeleteContract } from "@/hooks/contracts/useDeleteContract";
import useEditContract from "@/hooks/contracts/useEditContract";
import { useGetAllContracts } from "@/hooks/contracts/useGetAllContracts";
import type { ContractDetails } from "@/types/Contract";
import type { Column } from "@/types/dataGrid";
import type { ContractFormData } from "@/validation/contractSchema";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const ContractsGridPage = (() => {
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
  const [editingContract, setEditingContract] =
    useState<ContractDetails | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingContract, setDeletingContract] =
    useState<ContractDetails | null>(null);

  const {
    contracts,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllContracts({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const createMutation = useCreateContract();
  const updateMutation = useEditContract();
  const deleteMutation = useDeleteContract();

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
    setEditingContract(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (contract: ContractDetails) => {
    setEditingContract(contract);
    setIsFormModalOpen(true);
  };

  const handleDelete = (contract: ContractDetails) => {
    setDeletingContract(contract);
    setIsDeleteModalOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = async (data: ContractFormData) => {
    if (editingContract) {
      await updateMutation.mutateAsync({
        id: editingContract.id,
        ...data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    refetch(); // Refresh the data
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleConfirmDelete = async () => {
    if (deletingContract) {
      await deleteMutation.mutateAsync(deletingContract.id);
      setIsDeleteModalOpen(false);
      setDeletingContract(null);
      refetch();
    }
  };

  const columns: Column<ContractDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "employee_full_name",
      title: "الاسم",
      sortable: true,
    },
    {
      key: "role_name_ar",
      title: "الدور",
      sortable: true,
    },
    {
      key: "base_salary",
      title: "المرتب الأساسى",
      sortable: true,
    },
    {
      key: "allowance",
      title: "بدلات",
      sortable: true,
    },
    {
      key: "effective_from",
      title: "مفعل من",
      sortable: true,
    },
    {
      key: "effective_to",
      title: "مفعل إلى",
      sortable: true,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<ContractDetails>
        title="ادارة العقود"
        columns={columns}
        data={contracts}
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
        onDelete={handleDelete}
        addButtonText="تسجيل عقد"
        entityName="عقد"
        searchPlaceholder="ابحث باسم العميل أو الدور..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.STAFF_CONTRACTS_VIEW}
        addPermission={PermissionKeys.STAFF_CONTRACTS_ADD}
        editPermission={PermissionKeys.STAFF_CONTRACTS_EDIT}
        deletePermission={PermissionKeys.STAFF_CONTRACTS_DELETE}
      />

      {isFormModalOpen && (
        <ContractFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={
            editingContract
              ? {
                  employee_id: editingContract.employee_id.toString(),
                  base_salary: editingContract.base_salary,
                  allowance: editingContract.allowance,
                  effective_from: editingContract.effective_from,
                  effective_to: editingContract.effective_to,
                }
              : undefined
          }
          isSubmitting={isSubmitting}
          isEditing={!!editingContract}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingContract(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Contract"
          description="Are you sure you want to delete this contract? This action cannot be undone."
          itemName={deletingContract?.employee_full_name}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}) satisfies React.FC;

export default ContractsGridPage;
