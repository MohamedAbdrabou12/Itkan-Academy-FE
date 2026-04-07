import DataGrid from "@/components/dataGrid/DataGrid";
import PayrollCycleEditFormModal from "@/components/modals/PayrollCycleEditFormModal";
import PayrollRecordFormModal from "@/components/modals/PayrollRecordFormModal";
import { PermissionKeys } from "@/constants/permissions";
import { usePermissionsGate } from "@/hooks/auth/usePermissionGate";
import useEditPayrollCycle from "@/hooks/payroll/useEditPayrollCycle";
import useEditPayrollRecord from "@/hooks/payroll/useEditPayrollRecord";
import { useGetPayrollCycle } from "@/hooks/payroll/useGetPayrollCycle";
import { useGetPayrollRecords } from "@/hooks/payroll/useGetPayrollRecords";
import type { Column } from "@/types/dataGrid";
import {
  PayrollCycleStatus,
  type PayrollCycleDetails,
} from "@/types/PayrollCycle";
import { type PayrollRecordDetails } from "@/types/PayrollRecord";
import type { PayrollCycleEditFormData } from "@/validation/payrollCycleSchema";
import type { PayrollRecordFormData } from "@/validation/payrollRecordSchema";
import { Pencil } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const PayrollRecordsGridPage = (() => {
  const location = useLocation();
  const cycleId = useMemo(
    () => location.pathname.split("/").pop()!,
    [location],
  );

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [editingPayrollRecord, setEditingPayrollRecord] =
    useState<PayrollRecordDetails | null>(null);

  const [editingCycle, setEditingCycle] = useState<PayrollCycleDetails | null>(
    null,
  );

  const { can } = usePermissionsGate();

  const {
    payrollRecords,
    itemsTotal,
    pagination: apiPagination,
    isPending,
    error,
    refetch: recordRefetch,
  } = useGetPayrollRecords({
    cycleId: cycleId!,
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const { cycle, refetch: cycleRefetch } = useGetPayrollCycle(cycleId);

  const recordUpdateMutation = useEditPayrollRecord();
  const cycleUpdateMutation = useEditPayrollCycle();

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

  const handleRecordEdit = (payrollRecord: PayrollRecordDetails) => {
    if (
      cycle &&
      [PayrollCycleStatus.APPROVED, PayrollCycleStatus.PAID].includes(
        cycle.status,
      )
    ) {
      toast.error("الدورة مغلقة للتعديلات");
      return;
    }

    setEditingPayrollRecord(payrollRecord);
  };

  const handleCycleEdit = () => {
    if (!cycle) return;
    if (
      [PayrollCycleStatus.APPROVED, PayrollCycleStatus.PAID].includes(
        cycle.status,
      ) &&
      !can([PermissionKeys.PAYROLL_CYCLES_APPROVE])
    ) {
      toast.error("الدورة مغلقة للتعديلات");
      return;
    }
    setEditingCycle(cycle);
  };

  // Handle form submission
  const handleRecordEditFormSubmit = async (data: PayrollRecordFormData) => {
    if (!editingPayrollRecord) return;
    await recordUpdateMutation.mutateAsync({
      id: editingPayrollRecord.id,
      ...data,
    });
    recordRefetch(); // Refresh the data
  };

  const handleCycleEditFormSubmit = async (data: PayrollCycleEditFormData) => {
    await cycleUpdateMutation.mutateAsync({
      status: data.status,
      id: editingCycle!.id,
    });
    cycleRefetch();
  };

  const isSubmitting = recordUpdateMutation.isPending;

  const columns: Column<PayrollRecordDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "employee_name",
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
      key: "bonuses",
      title: "الزيادات",
      sortable: true,
    },
    {
      key: "deductions",
      title: "الخصومات",
      sortable: true,
    },
    {
      key: "total",
      title: "الاجمالى",
    },
  ];

  const title = cycle
    ? `ادارة المرتبات لدورة ${cycle.month}/${cycle.year}`
    : "ادارة المرتبات";

  const status = cycle
    ? cycle.status == PayrollCycleStatus.DRAFT
      ? "جاهزة للتعديل"
      : cycle.status == PayrollCycleStatus.LOCKED
        ? "فى انتظار القبول"
        : cycle.status == PayrollCycleStatus.APPROVED
          ? "مقبولة"
          : "مدفوعة"
    : undefined;

  const extraInfo =
    itemsTotal && status
      ? `الإجمالى: ${itemsTotal} الحالة: ${status}`
      : itemsTotal
        ? `الإجمالى: ${itemsTotal}`
        : status
          ? `الحالة: ${status}`
          : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<PayrollRecordDetails>
        title={title}
        extraInfo={extraInfo}
        columns={columns}
        data={payrollRecords}
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
        onEdit={handleRecordEdit}
        onAddNew={handleCycleEdit}
        addButtonText="تعديل الحالة"
        addButtonIcon={<Pencil className="h-4 w-4" />}
        entityName="مرتب"
        searchPlaceholder="ابحث باسم العميل أو الدور..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.PAYROLL_CYCLES_VIEW}
        addPermission={PermissionKeys.PAYROLL_CYCLES_EDIT}
        editPermission={PermissionKeys.PAYROLL_CYCLES_EDIT}
      />

      {editingPayrollRecord && (
        <PayrollRecordFormModal
          isOpen={editingPayrollRecord !== null}
          onClose={() => setEditingPayrollRecord(null)}
          onSubmit={handleRecordEditFormSubmit}
          initialData={{
            bonuses: editingPayrollRecord.bonuses,
            deductions: editingPayrollRecord.deductions,
          }}
          isSubmitting={isSubmitting}
        />
      )}

      {editingCycle && (
        <PayrollCycleEditFormModal
          isOpen={true}
          onClose={() => setEditingCycle(null)}
          initialData={editingCycle}
          onSubmit={handleCycleEditFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}) satisfies React.FC;

export default PayrollRecordsGridPage;
