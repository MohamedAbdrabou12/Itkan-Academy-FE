import DataGrid from "@/components/dataGrid/DataGrid";
import { StaffFormModal } from "@/components/modals/StaffFormModal";
import { PermissionKeys } from "@/constants/Permissions";
import { useGetAllStaff } from "@/hooks/staff/useGetStaff";
import type { Column } from "@/types/dataGrid";
import type { StaffDetails } from "@/types/users";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const StaffRoleGridPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<StaffDetails | null>(null);

  const {
    staff,
    pagination: apiPagination,
    isPending,
    error,
  } = useGetAllStaff({
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
      page: 1,
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
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleEditStaff = (user: StaffDetails) => {
    setEditingUser(user);
    setIsStaffModalOpen(true);
  };

  const handleAddStaff = () => {
    setEditingUser(null);
    setIsStaffModalOpen(true);
  };

  const columns: Column<StaffDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "full_name",
      title: "المستخدم",
      sortable: true,
    },
    {
      key: "email",
      title: "البريد الإلكتروني",
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
      key: "role_name_ar",
      title: "الدور",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "branches",
      title: "الفروع",
      sortable: false,
      render: (_, user: StaffDetails) => {
        const branches = user.branches;
        if (!branches || branches.length === 0) {
          return <span className="block text-center text-gray-500">-</span>;
        }

        return (
          <div className="space-y-1 text-center">
            {branches.map((branch, index) => (
              <div
                key={branch.id}
                className={`text-sm ${
                  index < branches.length - 1
                    ? "border-b border-gray-100 pb-1"
                    : ""
                }`}
              >
                {branch.name}
              </div>
            ))}
          </div>
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
      <DataGrid<StaffDetails>
        title="إدارة المديرين"
        columns={columns}
        data={staff}
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
        onEdit={handleEditStaff}
        onAddNew={handleAddStaff}
        searchPlaceholder="ابحث بالاسم أو البريد الإلكتروني..."
        entityName="مدير"
        addButtonText="اضافة مدير"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        viewPermission={PermissionKeys.SYSTEM_STAFF_VIEW}
        editPermission={PermissionKeys.SYSTEM_STAFF_EDIT}
        addPermission={PermissionKeys.SYSTEM_STAFF_ADD}
      />

      {isStaffModalOpen && (
        <StaffFormModal
          isOpen={isStaffModalOpen}
          onClose={() => {
            setIsStaffModalOpen(false);
            setEditingUser(null);
          }}
          initialValues={
            editingUser
              ? {
                  id: editingUser.id,
                  full_name: editingUser.full_name,
                  email: editingUser.email,
                  phone: editingUser.phone,
                  role_id: String(editingUser.role_id),
                  branch_ids: editingUser.branches?.map((branch) =>
                    String(branch.id),
                  ),
                  status: editingUser.status,
                }
              : null
          }
        />
      )}
    </div>
  );
};

export default StaffRoleGridPage;
