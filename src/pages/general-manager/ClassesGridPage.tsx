import DataGrid from "@/components/dataGrid/DataGrid";
import { ClassFormModal } from "@/components/modals/ClassFormModal";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { PermissionKeys } from "@/constants/permissions";
import { useDeleteClass } from "@/hooks/classes/useDeleteClass";
import { useGetAllClasses } from "@/hooks/classes/useGetAllClassess";
import type { Class } from "@/types/classes";
import type { Column } from "@/types/dataGrid";
import { englishToArabicDayMap } from "@/utils/getArabicDayName";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const ClassesGridPage = () => {
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
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingClass, setDeletingClass] = useState<Class | null>(null);

  // Use the hook with parameters (you might need to update your hook to accept params)
  const {
    classes,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllClasses({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const deleteMutation = useDeleteClass();

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
    setEditingClass(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (classData: Class) => {
    setEditingClass(classData);
    setIsFormModalOpen(true);
  };

  const handleDelete = (classData: Class) => {
    setDeletingClass(classData);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deletingClass) {
      await deleteMutation.mutateAsync(deletingClass.id);
      setIsDeleteModalOpen(false);
      setDeletingClass(null);
      refetch();
    }
  };

  const columns: Column<Class>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "name",
      sortable: true,
    },

    {
      key: "schedule",
      title: "مواعيد الحصص",
      sortable: true,
      render: (value: unknown) => (
        <span dir="ltr" className="text-left">
          {Object.keys(value as Record<string, string[]>)
            .map(
              (key) =>
                englishToArabicDayMap[
                  key as keyof typeof englishToArabicDayMap
                ],
            )
            .join(" , ")}
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
      <DataGrid<Class>
        title="ادارة الفصول"
        columns={columns}
        data={classes}
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
        addButtonText="اضافة فصل"
        entityName="فصل"
        searchPlaceholder="ابحث باسم الفصل..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.ACADEMIC_CLASSES_VIEW}
        addPermission={PermissionKeys.ACADEMIC_CLASSES_ADD}
        editPermission={PermissionKeys.ACADEMIC_CLASSES_EDIT}
        deletePermission={PermissionKeys.ACADEMIC_CLASSES_DELETE}
      />
      {isFormModalOpen && (
        <ClassFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          initialValues={editingClass ? editingClass : null}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setDeletingClass(null);
          }}
          onConfirm={handleConfirmDelete}
          title="ازالة فصل"
          description="هل انت متاكد من ازالة الفصل, لا يمكنك الرجوع عن هذا الاجراء"
          itemName={deletingClass?.name}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
};

export default ClassesGridPage;
