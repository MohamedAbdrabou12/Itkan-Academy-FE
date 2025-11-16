import DataGrid from "@/components/dataGrid/DataGrid";
import { UsersRoleModal } from "@/components/modals/UsersRoleModal";
import { useGetAllUsers } from "@/hooks/users/useGetUsers";
import { useUpdateUserRole } from "@/hooks/users/useUpdateUserRole";
import type { Column } from "@/types/dataGrid";
// import { PermissionKeys } from "@/types/permissions";
import type { UpdateUserRoleData } from "@/types/Roles";
import type { UserDetails } from "@/types/users";
import { useState } from "react";

const PAGE_SIZE = 10;
const PAGE_SIZE_OPTIONS = [5, 10];

const UsersRoleGridPage = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: PAGE_SIZE,
  });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id" as string,
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDetails | null>(null);

  const {
    users,
    pagination: apiPagination,
    isPending,
    error,
    refetch,
  } = useGetAllUsers({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });
  const { updateUserRole, isPending: updateUserRoleIsPending } =
    useUpdateUserRole();

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

  const handleEditRoles = (user: UserDetails) => {
    setEditingUser(user);
    setIsRolesModalOpen(true);
  };

  const handleFormSubmit = async (data: UpdateUserRoleData) => {
    console.log("Update user roles:", data);
    updateUserRole(data);
    refetch();
  };

  const columns: Column<UserDetails>[] = [
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
      key: "role_name_ar",
      title: "الوظيفة",
      sortable: true,
      render: (value: unknown) => (
        <span className="font-medium">{String(value)}</span>
      ),
    },
    {
      key: "branches",
      title: "الفروع",
      sortable: false,
      render: (_, user: UserDetails) => {
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
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<UserDetails>
        title="إدارة المستخدمين"
        columns={columns}
        data={users}
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
        onEdit={handleEditRoles}
        searchPlaceholder="ابحث بالاسم أو البريد الإلكتروني..."
        entityName="مستخدم"
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        enableSearch={true}
        enableFilters={true}
        // permission={PermissionKeys.SYSTEM_ROLE_PERMISSIONS_MANAGE}
      />

      {isRolesModalOpen && editingUser && (
        <UsersRoleModal
          isOpen={isRolesModalOpen}
          onClose={() => {
            setIsRolesModalOpen(false);
            setEditingUser(null);
          }}
          onSubmit={handleFormSubmit}
          user={editingUser}
          isSubmitting={updateUserRoleIsPending}
        />
      )}
    </div>
  );
};

export default UsersRoleGridPage;
