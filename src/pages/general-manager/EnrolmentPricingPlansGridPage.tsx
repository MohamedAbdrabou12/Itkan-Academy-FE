import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { EnrolmentPricingPlanFormModal } from "@/components/modals/EnrolmentPricingPlanFormModal";
import { PermissionKeys } from "@/constants/permissions";
import { useDeleteEnrolmentPricingPlan } from "@/hooks/enrolmentPricingPlans/useDeleteEnrolmentPricingPlan";
import { useGetAllEnrolmentPricingPlans } from "@/hooks/enrolmentPricingPlans/useGetAllEnrolmentPricingPlans";
import type { Column } from "@/types/dataGrid";
import type { EnrolmentPricingPlan } from "@/types/enrolment";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const EnrolmentPricingPlansGridPage = () => {
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
  const [editingPricingPlan, setEditingPricingPlan] =
    useState<EnrolmentPricingPlan | null>(null);
  const [deletingPricingPlan, setDeletingPricingPlan] =
    useState<EnrolmentPricingPlan | null>(null);

  const {
    pricingPlans,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllEnrolmentPricingPlans({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const deleteMutation = useDeleteEnrolmentPricingPlan();

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
    setEditingPricingPlan(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (plan: EnrolmentPricingPlan) => {
    setEditingPricingPlan(plan);
    setIsFormModalOpen(true);
  };

  const handleDelete = (plan: EnrolmentPricingPlan) => {
    setDeletingPricingPlan(plan);
  };

  const handleConfirmDelete = async () => {
    if (deletingPricingPlan) {
      await deleteMutation.mutateAsync(deletingPricingPlan.id);
      setDeletingPricingPlan(null);
      refetch();
    }
  };

  const columns: Column<EnrolmentPricingPlan>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "الاسم",
      sortable: true,
    },
    { key: "curriculum_name", title: "المنهج", sortable: true },
    {
      key: "branch_name",
      title: "الفرع",
      sortable: true,
    },
    {
      key: "monthly_price",
      title: "المبلغ الشهري",
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
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<EnrolmentPricingPlan>
        title="ادارة خطط دفع الالتحاق"
        columns={columns}
        data={pricingPlans}
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
        addButtonText="اضافة خطة دفع"
        entityName="خطة دفع"
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
        <EnrolmentPricingPlanFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          initialValues={
            editingPricingPlan
              ? {
                  id: editingPricingPlan.id,
                  curriculum_id: editingPricingPlan.curriculum_id.toString(),
                  branch_id: editingPricingPlan.branch_id?.toString(),
                  name: editingPricingPlan.name,
                  monthly_price: editingPricingPlan.monthly_price,
                  start_month: editingPricingPlan.start_month.toString(),
                  end_month: editingPricingPlan.end_month.toString(),
                }
              : null
          }
        />
      )}

      {deletingPricingPlan && (
        <DeleteConfirmationModal
          isOpen={!!deletingPricingPlan}
          onClose={() => setDeletingPricingPlan(null)}
          onConfirm={handleConfirmDelete}
          title="ازالة خطة الدفع"
          description="هل انت متاكد من ازالة خطة الدفع, لا يمكنك الرجوع عن هذا الاجراء"
          itemName={deletingPricingPlan.name}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default EnrolmentPricingPlansGridPage;
