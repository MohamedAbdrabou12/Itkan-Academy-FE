import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { PermissionKeys } from "@/constants/permissions";
import { useDeleteExam } from "@/hooks/Exams/useDeleteExam";
import { useGetAllExams } from "@/hooks/Exams/useGetAllExams";
import { useAuthStore } from "@/stores/auth";
import type { Column } from "@/types/dataGrid";
import { ExamStatus, type Exam } from "@/types/exams";
import { getExamStatus } from "@/utils/exams";
import { formatArabicDate } from "@/utils/formatDate";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

export default function ExamsGridPage({
  setActiveMood,
  setExamToEdit,
}: {
  setActiveMood: (mood: "view" | "edit" | "add") => void;
  setExamToEdit: (exam: Exam | null) => void;
}) {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState<Exam | null>(null);
  const activeBranch = useAuthStore((state) => state.activeBranch);
  const deleteExamMutation = useDeleteExam();

  // Use the hook with parameters (you might need to update your hook to accept params)
  const {
    exams,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllExams({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
    activeBranch: activeBranch?.id,
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
    setActiveMood("add");
  };

  const handleEdit = (exam: Exam) => {
    setActiveMood("edit");
    setExamToEdit(exam);
  };

  const handleDelete = (exam: Exam) => {
    setIsDeleteModalOpen(true);
    setExamToDelete(exam);
  };

  const handleConfirmDelete = async () => {
    if (examToDelete) {
      await deleteExamMutation.mutateAsync(`${examToDelete.id}`);
      setIsDeleteModalOpen(false);
      setExamToDelete(null);
      refetch();
    }
  };

  const columns: Column<Exam>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "title",
      title: "العنوان",
      sortable: true,
    },
    {
      key: "start_time",
      title: "تاريخ بداية الامتحان",
      sortable: true,
      render: (value: unknown) => {
        return <span>{formatArabicDate(new Date(value as string))}</span>;
      },
    },
    {
      key: "end_time",
      title: "تاريخ نهاية الامتحان",
      sortable: true,
      render: (value: unknown) => {
        return <span>{formatArabicDate(new Date(value as string))}</span>;
      },
    },
    {
      key: "total_marks",
      title: "الدرجة النهائية",
      sortable: true,
    },
    {
      key: "questions",
      title: "عدد الاسئلة",
      sortable: true,
      render: (value: unknown) => {
        return (
          <span>
            {(Array.isArray(value) && value.length) || "لا توجد اسئلة"}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "الحالة",
      sortable: true,
      render: (value: unknown) => (
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            value === ExamStatus.DRAFT
              ? "bg-yellow-100 text-yellow-800"
              : value === ExamStatus.PUBLISHED
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {getExamStatus(value as ExamStatus)}
        </span>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<Exam>
        title="ادارة الأمتحانات"
        columns={columns}
        data={exams}
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
        addButtonText="اضافة امتحان"
        entityName="إمتحانات"
        searchPlaceholder="ابحث بعنوان الامتحان..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.ACADEMIC_EXAMS_VIEW}
        addPermission={PermissionKeys.ACADEMIC_EXAMS_ADD}
        editPermission={PermissionKeys.ACADEMIC_EXAMS_EDIT}
        deletePermission={PermissionKeys.ACADEMIC_EXAMS_DELETE}
      />

      {/* {isFormModalOpen && (
        <CreateExamModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
        />
      )}

      )} */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setExamToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          title="ازالة امتحان"
          description="هل انت متاكد من ازالة الامتحان؟, لا يمكنك الرجوع عن هذا الاجراء"
          itemName={examToDelete?.title}
          isDeleting={deleteExamMutation.isPending}
        />
      )}
    </div>
  );
}
