import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import { BranchFormModal } from "@/components/modals/BranchFormModal";
import { useCreateBranch } from "@/hooks/branches/useCreateBranch";
import { useDeleteBranch } from "@/hooks/branches/useDeleteBranch";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useUpdateBranch } from "@/hooks/branches/useUpdateBranch";
import type { Column } from "@/types/dataGrid";
import type { BranchDetails } from "@/types/Branches";
import { formatDate } from "@/utils/formatDate";
import type { BranchFormData } from "@/validation/branchSchema";
import { useState } from "react";

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];

const BranchesGridPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "name" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchDetails | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingBranch, setDeletingBranch] = useState<BranchDetails | null>(null);

  const {
    branches,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllBranches({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const createMutation = useCreateBranch();
  const updateMutation = useUpdateBranch();
  const deleteMutation = useDeleteBranch();

  const handlePageChange = (page: number) => setPagination((prev) => ({ ...prev, page }));

  const handlePageSizeChange = (pageSize: number) =>
    setPagination((prev) => ({ ...prev, pageSize, page: 1 }));

  const handleSort = (sortBy: string) =>
    setSortInfo((prev) => ({
      sortBy,
      sortOrder:
        prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
    }));

  const handleSearch = (search: string) => {
    setSearchTerm(search);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleFilter = (filters: Record<string, unknown>) => {
    console.log("Filters applied:", filters);
  };

  const handleAddNew = () => {
    setEditingBranch(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (branch: BranchDetails) => {
    setEditingBranch(branch);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (data: BranchFormData) => {
    if (editingBranch) {
      await updateMutation.mutateAsync({ id: editingBranch.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    refetch();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const handleConfirmDelete = async () => {
    if (deletingBranch) {
      await deleteMutation.mutateAsync(deletingBranch.id);
      setIsDeleteModalOpen(false);
      setDeletingBranch(null);
      refetch();
    }
  };

  const columns: Column<BranchDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "name",
      title: "اسم الفرع",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-semibold text-gray-800">{String(value)}</span>
      ),
    },
    {
      key: "email",
      title: "البريد الإلكتروني",
      sortable: true,
      render: (value: unknown) => (
        <a
          href={`mailto:${value}`}
          className="text-emerald-700 hover:underline"
        >
          {String(value)}
        </a>
      ),
    },
    {
      key: "phone",
      title: "رقم الهاتف",
      sortable: true,
      render: (value: unknown) => (
        <a
          href={`tel:${value}`}
          className="text-emerald-600 hover:text-emerald-700 font-medium"
          dir="ltr"
        >
          {String(value)}
        </a>
      ),
    },
    {
      key: "status",
      title: "الحالة",
      sortable: true,
      render: (value: unknown) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            value === "active"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value === "active" ? "نشط" : "غير نشط"}
        </span>
      ),
    },
    {
      key: "created_at",
      title: "تاريخ الإنشاء",
      sortable: true,
      render: (value: unknown) => (
        <span className="text-gray-600">{formatDate(value)}</span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16 shadow-lg mb-10 rounded-b-3xl">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">إدارة الفروع</h1>
          <p className="text-lg opacity-90">
            يمكنك من هنا إدارة كافة الفروع، تعديل بياناتها أو إضافة فرع جديد بسهولة.
          </p>
        </div>
      </section>

      {/* Data Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
          <DataGrid<BranchDetails>
            title="قائمة الفروع"
            columns={columns}
            data={branches}
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
            onFilter={handleFilter}
            onAddNew={handleAddNew}
            onEdit={handleEdit}
            addButtonText="إضافة فرع"
            entityName="فرع"
            pageSizeOptions={PAGE_SIZE_OPTIONS}
            enableSearch={true}
            enableFilters={false}
          />
        </div>
      </div>

      {/* Form Modal */}
      <BranchFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={
          editingBranch
            ? {
                name: editingBranch.name,
                email: editingBranch.email,
                phone: editingBranch.phone,
                address: editingBranch.address,
                status: editingBranch.status,
              }
            : undefined
        }
        isSubmitting={isSubmitting}
        isEditing={!!editingBranch}
      />

      {/* Delete Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingBranch(null);
        }}
        onConfirm={handleConfirmDelete}
        title="حذف الفرع"
        description="هل أنت متأكد أنك تريد حذف هذا الفرع؟ هذا الإجراء لا يمكن التراجع عنه."
        itemName={deletingBranch?.name}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
};

export default BranchesGridPage;








// import DataGrid from "@/components/dataGrid/DataGrid";
// import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
// import { BranchFormModal } from "@/components/modals/BranchFormModal";
// import { useCreateBranch } from "@/hooks/branches/useCreateBranch";
// import { useDeleteBranch } from "@/hooks/branches/useDeleteBranch";
// import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
// import { useUpdateBranch } from "@/hooks/branches/useUpdateBranch";
// import type { Column } from "@/types/dataGrid";
// import type { BranchDetails } from "@/types/Branches";
// import { formatDate } from "@/utils/formatDate";
// import type { BranchFormData } from "@/validation/branchSchema";
// import { useState } from "react";

// const PAGE_SIZE = 5;
// const PAGE_SIZE_OPTIONS = [5, 10];

// const BranchesGridPage = () => {
//   const [pagination, setPagination] = useState({
//     page: 1,
//     pageSize: PAGE_SIZE,
//   });
//   const [sortInfo, setSortInfo] = useState({
//     sortBy: "name" as string,
//     sortOrder: "asc" as "asc" | "desc",
//   });
//   const [searchTerm, setSearchTerm] = useState("");

//   const [isFormModalOpen, setIsFormModalOpen] = useState(false);
//   const [editingBranch, setEditingBranch] = useState<BranchDetails | null>(
//     null,
//   );
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [deletingBranch, setDeletingBranch] = useState<BranchDetails | null>(
//     null,
//   );

//   // Use the hook with parameters (you might need to update your hook to accept params)
//   const {
//     branches,
//     pagination: apiPagination,
//     isPending,
//     error,
//     refetch,
//   } = useGetAllBranches({
//     page: pagination.page,
//     size: pagination.pageSize,
//     search: searchTerm,
//     sort_by: sortInfo.sortBy,
//     sort_order: sortInfo.sortOrder,
//   });

//   const createMutation = useCreateBranch();
//   const updateMutation = useUpdateBranch();
//   const deleteMutation = useDeleteBranch();

//   // Event handlers
//   const handlePageChange = (page: number) => {
//     setPagination((prev) => ({ ...prev, page }));
//   };

//   const handlePageSizeChange = (pageSize: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       pageSize,
//       page: 1, // Reset to first page when changing page size
//     }));
//   };

//   const handleSort = (sortBy: string) => {
//     setSortInfo((prev) => ({
//       sortBy,
//       sortOrder:
//         prev.sortBy === sortBy && prev.sortOrder === "asc" ? "desc" : "asc",
//     }));
//   };

//   const handleSearch = (search: string) => {
//     setSearchTerm(search);
//     setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page when searching
//   };

//   const handleFilter = (filters: Record<string, unknown>) => {
//     // If you want to implement filters later, add them here
//     console.log("Filters applied:", filters);
//   };

//   const handleAddNew = () => {
//     setEditingBranch(null);
//     setIsFormModalOpen(true);
//   };

//   const handleEdit = (branch: BranchDetails) => {
//     setEditingBranch(branch);
//     setIsFormModalOpen(true);
//   };

//   // Handle form submission
//   const handleFormSubmit = async (data: BranchFormData) => {
//     if (editingBranch) {
//       await updateMutation.mutateAsync({
//         id: editingBranch.id,
//         ...data,
//       });
//     } else {
//       await createMutation.mutateAsync(data);
//     }
//     refetch(); // Refresh the data
//   };

//   const isSubmitting = createMutation.isPending || updateMutation.isPending;

//   const handleConfirmDelete = async () => {
//     if (deletingBranch) {
//       await deleteMutation.mutateAsync(deletingBranch.id);
//       setIsDeleteModalOpen(false);
//       setDeletingBranch(null);
//       refetch();
//     }
//   };

//   // const handleView = (branch: BranchDetails) => {
//   //   console.log("View branch:", branch);
//   //   // Implement view branch functionality
//   // };

//   const columns: Column<BranchDetails>[] = [
//     { key: "id", title: "#", sortable: true },
//     {
//       key: "name",
//       title: "الاسم",
//       sortable: true,
//     },
//     {
//       key: "email",
//       title: "البريد الالكتروني",
//       sortable: true,
//     },
//     {
//       key: "phone",
//       title: "رقم الهاتف",
//       sortable: true,
//       render: (value: unknown) => (
//         <span dir="ltr" className="text-left">
//           {String(value)}
//         </span>
//       ),
//     },
//     {
//       key: "status",
//       title: "الحالة",
//       sortable: true,
//       render: (value: unknown) => (
//         <span
//           className={`rounded-full px-2 py-1 text-xs font-medium ${
//             value === "active"
//               ? "bg-green-100 text-green-800"
//               : "bg-red-100 text-red-800"
//           }`}
//         >
//           {value === "active" ? "نشط" : "غير نشط"}
//         </span>
//       ),
//     },
//     {
//       key: "created_at",
//       title: "تاريخ الانشاء",
//       sortable: true,
//       render: (value: unknown) => formatDate(value),
//     },
//   ];

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <DataGrid<BranchDetails>
//         title="ادارة الفروع"
//         columns={columns}
//         data={branches}
//         loading={isPending}
//         error={error?.message || null}
//         pagination={{
//           page: apiPagination?.page || 1,
//           pageSize: apiPagination?.pageSize || PAGE_SIZE,
//           total: apiPagination?.total || 0,
//           totalPages: apiPagination?.totalPages || 0,
//         }}
//         onPageChange={handlePageChange}
//         onPageSizeChange={handlePageSizeChange}
//         sortInfo={sortInfo}
//         onSort={handleSort}
//         onSearch={handleSearch}
//         onFilter={handleFilter}
//         onAddNew={handleAddNew}
//         onEdit={handleEdit}
//         // onView={handleView}
//         addButtonText="اضافة فرع"
//         entityName="فرع"
//         pageSizeOptions={PAGE_SIZE_OPTIONS}
//         enableSearch={true}
//         enableFilters={false} // Set to true if you implement filters
//       />

//       <BranchFormModal
//         isOpen={isFormModalOpen}
//         onClose={() => setIsFormModalOpen(false)}
//         onSubmit={handleFormSubmit}
//         initialData={
//           editingBranch
//             ? {
//                 name: editingBranch.name,
//                 email: editingBranch.email,
//                 phone: editingBranch.phone,
//                 address: editingBranch.address,
//                 status: editingBranch.status,
//               }
//             : undefined
//         }
//         isSubmitting={isSubmitting}
//         isEditing={!!editingBranch}
//       />

//       <DeleteConfirmationModal
//         isOpen={isDeleteModalOpen}
//         onClose={() => {
//           setIsDeleteModalOpen(false);
//           setDeletingBranch(null);
//         }}
//         onConfirm={handleConfirmDelete}
//         title="Delete Branch"
//         description="Are you sure you want to delete this branch? This action cannot be undone."
//         itemName={deletingBranch?.name}
//         isDeleting={deleteMutation.isPending}
//       />
//     </div>
//   );
// };

// export default BranchesGridPage;
