import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import PayrollCycleEditFormModal from "@/components/modals/PayrollCycleEditFormModal";
import PayrollCycleGenerateFormModal from "@/components/modals/PayrollCycleGenerateFormModal";
import { PermissionKeys } from "@/constants/permissions";
import { useDeletePayrollCycle } from "@/hooks/payroll/useDeletePayrollCycle";
import useEditPayrollCycle from "@/hooks/payroll/useEditPayrollCycle";
import { useGeneratePayrollCycle } from "@/hooks/payroll/useGeneratePayrollCycle";
import { useGetAllPayrollCycles } from "@/hooks/payroll/useGetAllPayrollCycles";
import type { Column } from "@/types/dataGrid";
import {
  PayrollCycleStatus,
  type PayrollCycleDetails,
} from "@/types/PayrollCycle";
import type {
  PayrollCycleEditFormData,
  PayrollCycleGenerateFormData,
} from "@/validation/payrollCycleSchema";
import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const PayrollCyclesGridPage = (() => {
  const navigate = useNavigate();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [isGenerateFormModalOpen, setIsGenerateFormModalOpen] = useState(false);
  const [editingCycle, setEditingCycle] = useState<PayrollCycleDetails | null>(
    null,
  );
  const [deletingCycle, setDeletingCycle] =
    useState<PayrollCycleDetails | null>(null);

  const {
    payrollCycles,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllPayrollCycles({
    page: pagination.page,
    size: pagination.pageSize,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const generateMutation = useGeneratePayrollCycle();
  const updateMutation = useEditPayrollCycle();
  const deleteMutation = useDeletePayrollCycle();

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

  const handleView = (item: PayrollCycleDetails) => {
    navigate(item.id.toString());
  };

  const handleConfirmDelete = async () => {
    if (deletingCycle) {
      await deleteMutation.mutateAsync(deletingCycle.id);
      setDeletingCycle(null);
      refetch();
    }
  };

  const handleAddNew = () => {
    setIsGenerateFormModalOpen(true);
  };

  const handleEdit = (cycle: PayrollCycleDetails) => {
    setEditingCycle(cycle);
  };

  const handleDelete = (cycle: PayrollCycleDetails) => {
    setDeletingCycle(cycle);
  };

  // Handle form submission
  const handleGenerateFormSubmit = async (
    data: PayrollCycleGenerateFormData,
  ) => {
    await generateMutation.mutateAsync(data);
    refetch(); // Refresh the data
  };

  const handleEditFormSubmit = async (data: PayrollCycleEditFormData) => {
    await updateMutation.mutateAsync({
      status: data.status,
      id: editingCycle!.id,
    });
    refetch();
  };

  const isSubmitting = generateMutation.isPending || updateMutation.isPending;

  const columns: Column<PayrollCycleDetails>[] = [
    { key: "id", title: "#", sortable: true },
    { key: "month", title: "الشهر", sortable: true },
    { key: "year", title: "السنة", sortable: true },
    {
      key: "status",
      title: "الحالة",
      sortable: true,
      render: (value) => (
        <span
          className={clsx(
            "rounded-full px-2 py-1 text-xs font-medium",
            value == PayrollCycleStatus.DRAFT
              ? "bg-gray-100 text-gray-800"
              : value == PayrollCycleStatus.APPROVED
                ? "bg-blue-100 text-blue-800"
                : value == PayrollCycleStatus.PAID
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800",
          )}
        >
          {value == PayrollCycleStatus.DRAFT
            ? "جاهزة للتعديل"
            : value == PayrollCycleStatus.LOCKED
              ? "فى انتظار القبول"
              : value == PayrollCycleStatus.APPROVED
                ? "مقبولة"
                : "مدفوعة"}
        </span>
      ),
    },
    {
      key: "created_by_name",
      title: "تم الإنشاء",
    },
    {
      key: "approved_by_name",
      title: "تم القبول",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<PayrollCycleDetails>
        title="ادارة دورات المرتب"
        columns={columns}
        data={payrollCycles}
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
        onView={handleView}
        onAddNew={handleAddNew}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={() => {}}
        addButtonText="إضافة دورة جديدة"
        entityName="دورة"
        searchPlaceholder=""
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={false}
        enableFilters={false}
        viewPermission={PermissionKeys.PAYROLL_CYCLES_VIEW}
        addPermission={PermissionKeys.PAYROLL_CYCLES_ADD}
        editPermission={PermissionKeys.PAYROLL_CYCLES_EDIT}
        deletePermission={PermissionKeys.PAYROLL_CYCLES_DELETE}
      />

      {isGenerateFormModalOpen && (
        <PayrollCycleGenerateFormModal
          isOpen={isGenerateFormModalOpen}
          onClose={() => setIsGenerateFormModalOpen(false)}
          onSubmit={handleGenerateFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {editingCycle !== null && (
        <PayrollCycleEditFormModal
          isOpen={true}
          onClose={() => setEditingCycle(null)}
          initialData={editingCycle}
          onSubmit={handleEditFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {deletingCycle !== null && (
        <DeleteConfirmationModal
          isOpen={true}
          onClose={() => {
            setDeletingCycle(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Delete Cycle"
          description="Are you sure you want to delete this cycle? This action cannot be undone."
          itemName={deletingCycle.month + "-" + deletingCycle.year}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}) satisfies React.FC;

export default PayrollCyclesGridPage;
