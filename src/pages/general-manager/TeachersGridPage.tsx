import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { TeacherFormModal } from "@/components/modals/TeacherFormModal";
import { PermissionKeys } from "@/constants/Permissions";
import { useDeleteTeacher } from "@/hooks/teachers/useDeleteTeacher";
import { useGetAllTeachers } from "@/hooks/teachers/useGetAllTeachers";
import type { Column } from "@/types/dataGrid";
import type { Teacher } from "@/types/teachers";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const TeachersGridPage = () => {
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
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState<Teacher | null>(null);

  // Use the hook with parameters (you might need to update your hook to accept params)
  const {
    teachers,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllTeachers({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const deleteMutation = useDeleteTeacher();

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
    setEditingTeacher(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setIsFormModalOpen(true);
  };

  const handleDelete = (teacher: Teacher) => {
    setDeletingTeacher(teacher);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingTeacher) {
      await deleteMutation.mutateAsync(deletingTeacher.id);
      setIsDeleteModalOpen(false);
      setDeletingTeacher(null);
      refetch();
    }
  };

  const columns: Column<Teacher>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "full_name",
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
      <DataGrid<Teacher>
        title="ادارة المعلمين"
        columns={columns}
        data={teachers}
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
        addButtonText="اضافة معلم"
        entityName="معلم"
        searchPlaceholder="ابحث باسم المعلم..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        addPermission={PermissionKeys.SYSTEM_TEACHER_PERMISSIONS_ADD}
        editPermission={PermissionKeys.SYSTEM_TEACHER_PERMISSIONS_EDIT}
        deletePermission={PermissionKeys.SYSTEM_TEACHER_PERMISSIONS_DELETE}
      />

      {isFormModalOpen && (
        <TeacherFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          initialValues={
            editingTeacher
              ? {
                  id: editingTeacher.id,
                  full_name: editingTeacher.full_name,
                  email: editingTeacher.email,
                  phone: editingTeacher.phone,
                  branch_ids: editingTeacher.branch_ids.map((branch_id) =>
                    String(branch_id),
                  ),
                  class_ids: editingTeacher.class_ids.map((class_id) =>
                    String(class_id),
                  ),
                }
              : null
          }
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingTeacher(null);
          }}
          onConfirm={handleConfirmDelete}
          title="ازالة معلم"
          description="هل انت متاكد من ازالة المعلم, لا يمكنك الرجوع عن هذا الاجراء"
          itemName={deletingTeacher?.full_name}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default TeachersGridPage;
