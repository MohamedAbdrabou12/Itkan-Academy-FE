import DataGrid from "@/components/dataGrid/DataGrid";
import { CurriculumFormModal } from "@/components/modals/CurriculumFormModal";
import { PermissionKeys } from "@/constants/permissions";
import { useGetAllCurriculums } from "@/hooks/curriculums/useGetAllCurriculums";
import type { Curriculum } from "@/types/Curriculum";
import type { Column } from "@/types/dataGrid";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const CurriculumGridPage = () => {
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
  const [editingCurriculum, setEditingCurriculum] = useState<Curriculum | null>(
    null,
  );

  const {
    curriculums,
    pagination: apiPagination,
    isPending,
    error,
  } = useGetAllCurriculums({
    page: pagination.page,
    size: pagination.pageSize,
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

  const handleAddNew = () => {
    setEditingCurriculum(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (curriculum: Curriculum) => {
    setEditingCurriculum(curriculum);
    setIsFormModalOpen(true);
  };

  const columns: Column<Curriculum>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "الاسم",
      sortable: true,
    },
    {
      key: "description",
      title: " الوصف",
      sortable: true,
    },
    {
      key: "academic_year",
      title: "السنة الدراسية",
      sortable: false,
    },
    {
      key: "is_active",
      title: "الحالة",
      sortable: true,
      render: (value: unknown) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === true
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {value === true ? "نشط" : "غير نشط"}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<Curriculum>
        title="ادارة المستويات الدراسية"
        columns={columns}
        data={curriculums}
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
        addButtonText="اضافة مستوى"
        entityName="مستوى"
        searchPlaceholder="ابحث باسم المستوى..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.ACADEMIC_CURRICULUM_VIEW}
        addPermission={PermissionKeys.ACADEMIC_CURRICULUM_ADD}
        editPermission={PermissionKeys.ACADEMIC_CURRICULUM_EDIT}
      />

      {isFormModalOpen && (
        <CurriculumFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          initialValues={
            editingCurriculum
              ? {
                  id: editingCurriculum.id,
                  name: editingCurriculum.name,
                  description: editingCurriculum.description,
                  academic_year: editingCurriculum.academic_year,
                  is_active: editingCurriculum.is_active,
                }
              : null
          }
        />
      )}
    </div>
  );
};

export default CurriculumGridPage;
