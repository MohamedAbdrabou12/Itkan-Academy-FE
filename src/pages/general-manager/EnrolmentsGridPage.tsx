import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { EnrolmentFormModal } from "@/components/modals/EnrolmentFormModal";
import { PermissionKeys } from "@/constants/permissions";
import { useDeleteEnrolment } from "@/hooks/enrolments/useDeleteEnrolment";
import { useGetAllEnrolments } from "@/hooks/enrolments/useGetAllEnrolments";
import type { Column } from "@/types/dataGrid";
import type { Enrolment } from "@/types/enrolment";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const EnrolmentsGridPage = () => {
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
  const [editingEnrolment, setEditingEnrolment] = useState<Enrolment | null>(
    null,
  );
  const [deletingEnrolment, setDeletingEnrolment] = useState<Enrolment | null>(
    null,
  );

  const {
    enrolments,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllEnrolments({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const deleteMutation = useDeleteEnrolment();

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
    setEditingEnrolment(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (enrolment: Enrolment) => {
    setEditingEnrolment(enrolment);
    setIsFormModalOpen(true);
  };

  const handleDelete = (enrolment: Enrolment) => {
    setDeletingEnrolment(enrolment);
  };

  const handleConfirmDelete = async () => {
    if (deletingEnrolment) {
      await deleteMutation.mutateAsync(deletingEnrolment.id);
      setDeletingEnrolment(null);
      refetch();
    }
  };

  const columns: Column<Enrolment>[] = [
    { key: "id", title: "#", sortable: true },
    { key: "pricing_plan_id", title: "رقم خطة الدفع", sortable: true },
    {
      key: "student_id",
      title: "رقم الطالب",
      sortable: true,
    },
    {
      key: "pricing_plan_name",
      title: "خطة الدفع",
      sortable: true,
    },
    {
      key: "student_full_name",
      title: "اسم الطالب",
      sortable: true,
    },
    {
      key: "start_month",
      title: "بداية من",
      sortable: false,
    },
    {
      key: "end_month",
      title: "نهاية في",
      sortable: false,
    },
    {
      key: "months_paid",
      title: "عدد الأشهر المدفوعه",
      sortable: false,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<Enrolment>
        title="ادارة الالتحاقات"
        columns={columns}
        data={enrolments}
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
        // onView={handleView}
        addButtonText="اضافة سجل التحاق"
        entityName="التحاق"
        searchPlaceholder="ابحث..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.ACADEMIC_ENROLMENTS_VIEW}
        addPermission={PermissionKeys.ACADEMIC_ENROLMENTS_ADD}
        editPermission={PermissionKeys.ACADEMIC_ENROLMENTS_EDIT}
        deletePermission={PermissionKeys.ACADEMIC_ENROLMENTS_DELETE}
      />

      {isFormModalOpen && (
        <EnrolmentFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          initialValues={
            editingEnrolment
              ? {
                  id: editingEnrolment.id,
                  pricing_plan_id: editingEnrolment.pricing_plan_id.toString(),
                  student_id: editingEnrolment.student_id.toString(),
                  months_paid: editingEnrolment.months_paid.toString(),
                }
              : null
          }
        />
      )}

      {deletingEnrolment && (
        <DeleteConfirmationModal
          isOpen={!!deletingEnrolment}
          onClose={() => setDeletingEnrolment(null)}
          onConfirm={handleConfirmDelete}
          title="ازالة سجل التحاق"
          description="هل انت متاكد من ازالة سجل الالتحاق, لا يمكنك الرجوع عن هذا الاجراء"
          itemName={`${deletingEnrolment.pricing_plan_name} - ${deletingEnrolment.student_full_name}`}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default EnrolmentsGridPage;
