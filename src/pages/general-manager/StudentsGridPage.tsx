import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { StudentFormModal } from "@/components/modals/StudentFormModal";
import { StudentDetailsModal } from "@/components/modals/StudentDetailsModal";
import { useCreateStudent } from "@/hooks/students/useCreateStudent";
import { useDeleteStudent } from "@/hooks/students/useDeleteStudent";
import { useGetAllStudents } from "@/hooks/students/useGetAllStudents";
import { useUpdateStudent } from "@/hooks/students/useUpdateStudent";
import type { Column } from "@/types/dataGrid";
import type { StudentDetails } from "@/types/Students";
import type { StudentFormData } from "@/validation/studentSchema";
import { useState } from "react";
import { PermissionKeys } from "@/constants/Permissions";

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];

const StudentsGridPage = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: PAGE_SIZE });
  const [sortInfo, setSortInfo] = useState({ sortBy: "student_id", sortOrder: "asc" as "asc" | "desc" });
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentDetails | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingStudent, setDeletingStudent] = useState<StudentDetails | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [viewingStudent, setViewingStudent] = useState<StudentDetails | null>(null);

  const { students, pagination: apiPagination, isPending, error, refetch } = useGetAllStudents({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();
  const deleteMutation = useDeleteStudent();

  const handlePageChange = (page: number) => setPagination(prev => ({ ...prev, page }));
  const handlePageSizeChange = (pageSize: number) => setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  const handleSort = (sortBy: string) => setSortInfo(prev => ({
    sortBy,
    sortOrder: prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
  }));
  const handleSearch = (search: string) => { setSearchTerm(search); setPagination(prev => ({ ...prev, page: 1 })); };
  const handleAddNew = () => { setEditingStudent(null); setIsFormModalOpen(true); };
  const handleEdit = (student: StudentDetails) => { setEditingStudent(student); setIsFormModalOpen(true); };
  const handleView = (student: StudentDetails) => { setViewingStudent(student); setIsDetailsModalOpen(true); };
  const handleDelete = (student: StudentDetails) => { setDeletingStudent(student); setIsDeleteModalOpen(true); };

  const handleConfirmDelete = async () => {
    if (!deletingStudent) return;
    try {
      await deleteMutation.mutateAsync(deletingStudent.student_id);
      setIsDeleteModalOpen(false);
      setDeletingStudent(null);
      refetch();
    } catch (error) { console.error(error); }
  };

  const handleFormSubmit = async (data: StudentFormData & { student_id?: number }) => {
    try {
      if (data.student_id) {
        await updateMutation.mutateAsync({ student_id: data.student_id, ...data });
      } else {
        await createMutation.mutateAsync(data);
      }
      refetch();
      setIsFormModalOpen(false);
      setEditingStudent(null);
    } catch (err) { console.error(err); }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const columns: Column<StudentDetails>[] = [
    { key: "student_id", title: "#", sortable: true },
    { key: "full_name", title: "الاسم", sortable: true },
    { key: "email", title: "البريد الإلكتروني", sortable: true },
    {
      key: "phone",
      title: "الهاتف",
      sortable: true,
      render: (v) => <span dir="ltr">{v != null ? String(v) : "-"}</span>,
    },
    {
      key: "status",
      title: "الحالة",
      sortable: true,
      render: (v) => {
        const value = String(v).toLowerCase();
        const classes = value === "active" ? "bg-green-100 text-green-800"
          : value === "pending" ? "bg-yellow-100 text-yellow-800"
          : value === "deactive" ? "bg-gray-100 text-gray-800"
          : value === "rejected" ? "bg-red-100 text-red-800"
          : "bg-gray-100 text-gray-800";

        const label = value === "active" ? "نشط"
          : value === "pending" ? "معلق"
          : value === "deactive" ? "مغلق"
          : value === "rejected" ? "مرفوض"
          : "غير نشط";

        return <span className={`rounded-full px-2 py-1 text-xs font-medium ${classes}`}>{label}</span>;
      },
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<StudentDetails>
        title="ادارة الطلاب"
        columns={columns}
        data={students}
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
        onView={handleView}
        onDelete={handleDelete}
        addButtonText="اضافة طالب"
        entityName="طالب"
        searchPlaceholder="ابحث باسم الطالب..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        viewPermission={PermissionKeys.SYSTEM_STUDENTS_VIEW}
        addPermission={PermissionKeys.SYSTEM_STUDENTS_ADD}
        editPermission={PermissionKeys.SYSTEM_STUDENTS_EDIT}
        deletePermission={PermissionKeys.SYSTEM_STUDENTS_DELETE}
        enableSearch
        enableFilters
      />

      {isFormModalOpen && (
        <StudentFormModal
          isOpen={isFormModalOpen}
          onClose={() => { setIsFormModalOpen(false); setEditingStudent(null); }}
          onSubmit={handleFormSubmit}
          initialData={
            editingStudent
              ? {
                  ...editingStudent,
                  student_id: editingStudent.student_id,
                  branch_ids: editingStudent.branch_ids || [],
                  class_ids: editingStudent.class_ids || [],
                  phone: editingStudent.phone || "",
                  admission_date: editingStudent.admission_date || "",
                }
              : undefined
          }
          isSubmitting={isSubmitting}
          isEditing={!!editingStudent}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => { setIsDeleteModalOpen(false); setDeletingStudent(null); }}
          onConfirm={handleConfirmDelete}
          title="حذف الطالب"
          description="هل أنت متأكد أنك تريد حذف هذا الطالب؟ هذا الإجراء لا يمكن التراجع عنه."
          itemName={deletingStudent?.full_name}
          isDeleting={deleteMutation.isPending}
        />
      )}

      {isDetailsModalOpen && viewingStudent && (
        <StudentDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => { setIsDetailsModalOpen(false); setViewingStudent(null); }}
          student={viewingStudent}
        />
      )}
    </div>
  );
};

export default StudentsGridPage;