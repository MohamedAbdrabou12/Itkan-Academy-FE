import DataGrid from "@/components/dataGrid/DataGrid";
import { DeleteConfirmationModal } from "@/components/modals/DeleteConfirmationModal";
import ParentFormModal from "@/components/modals/ParentFormModal";
import ParentDetailsModal from "@/components/modals/ParentDetailsModal";

import { useCreateParent } from "@/hooks/parents/useCreateParent";
import { useGetAllParents } from "@/hooks/parents/useGetAllParents";
import { useUpdateParent } from "@/hooks/parents/useUpdateParent";
import { useLinkChild } from "@/hooks/parents/useLinkChild";
import { useUnlinkChild } from "@/hooks/parents/useUnlinkChild";

import { useState } from "react";

import type { Column } from "@/types/dataGrid";
import type { ParentDetails, ParentChildInfo } from "@/types/Parents";
import type { ParentCreateForm, ParentUpdateForm } from "@/validation/parentSchema";

import { ParentStatus, RelationshipType } from "@/types/Parents";
import { StudentStatus } from "@/types/Students";

import { PermissionKeys } from "@/constants/permissions";

const toast = {
  error: (message: string) => console.error(`Toast Error: ${message}`),
  success: (message: string) => console.log(`Toast Success: ${message}`),
};

const PAGE_SIZE = 5;
const PAGE_SIZE_OPTIONS = [5, 10];

type ParentFormSubmitData =
  | (ParentCreateForm & { children_ids: number[] })
  | (ParentUpdateForm & { parent_id: number; children_ids: number[] });

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'object' && error !== null && 'response' in error && error.response && typeof error.response === 'object' && 'data' in error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data && typeof error.response.data.message === 'string') {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred while processing the request.";
};

const ParentsGridPage = () => {
  const [pagination, setPagination] = useState({ page: 1, pageSize: PAGE_SIZE });
  const [sortInfo, setSortInfo] = useState({
    sortBy: "id",
    sortOrder: "asc" as "asc" | "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingParent, setEditingParent] = useState<ParentDetails | null>(null);
  const [apiFormError, setApiFormError] = useState<string | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingParent, setDeletingParent] = useState<ParentDetails | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewingParent, setViewingParent] = useState<ParentDetails | null>(null);

  const {
    parents,
    pagination: apiPagination,
    isPending,
    error,
  } = useGetAllParents({
    page: pagination.page,
    size: pagination.pageSize,
    search: searchTerm,
    sort_by: sortInfo.sortBy,
    sort_order: sortInfo.sortOrder,
  });

  const createMutation = useCreateParent();
  const updateMutation = useUpdateParent();
  const linkMutation = useLinkChild();
  const unlinkMutation = useUnlinkChild();

  const handlePageChange = (page: number) =>
    setPagination((prev) => ({ ...prev, page }));
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

  const handleAdd = () => {
    setApiFormError(null);
    setEditingParent(null);
    setIsFormOpen(true);
  };

  const handleEdit = (p: ParentDetails) => {
    setApiFormError(null);
    setEditingParent(p);
    setIsFormOpen(true);
  };

  const handleView = (p: ParentDetails) => {
    setViewingParent(p);
    setIsDetailsOpen(true);
  };

  const handleDelete = (p: ParentDetails) => {
    setDeletingParent(p);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingParent) return;

    const hasActiveChildren = deletingParent.children?.some(
      (child) => child.status === StudentStatus.ACTIVE
    );

    if (hasActiveChildren) {
      toast.error(
        `لا يمكن تعطيل ولي الأمر ${deletingParent.user.full_name} لوجود أبناء نشطين (Active). يجب تعطيل الأبناء أولاً.`
      );
      setIsDeleteOpen(false);
      return;
    }

    try {
      await updateMutation.mutateAsync({
        parent_id: deletingParent.id,
        status: ParentStatus.DEACTIVE,
      });

      toast.success(`تم تعطيل ولي الأمر ${deletingParent.user.full_name} بنجاح.`);
      setIsDeleteOpen(false);
      setDeletingParent(null);
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const handleFormSubmit = async (data: ParentFormSubmitData) => {
    setApiFormError(null);
    
    const isEditing = !!editingParent;

    try {
      let parentResult: ParentDetails | null = null;
      let existingChildrenIds: number[] = [];
      const childrenIds = data.children_ids ?? [];

      if ("parent_id" in data && data.parent_id) {
        const updatePayload: ParentUpdateForm & { parent_id: number } = data;
        parentResult = await updateMutation.mutateAsync(updatePayload);
        existingChildrenIds = editingParent?.children?.map((c) => c.student_id) ?? [];
      } else {
        const createPayload: ParentCreateForm = {
          full_name: data.full_name!,
          email: data.email!,
          relationship_type: data.relationship_type!,
          status: data.status ?? ParentStatus.PENDING,
          phone: data.phone ?? null,
          occupation: data.occupation ?? null,
          address: data.address ?? null,
        };
        parentResult = await createMutation.mutateAsync(createPayload);
      }

      if (!parentResult) return;

      const parentId = parentResult.id;

      toast.success(
        isEditing
          ? `تم تحديث ولي الأمر ${parentResult.user.full_name} بنجاح.`
          : `تم إضافة ولي الأمر ${parentResult.user.full_name} بنجاح.`
      );

      setIsFormOpen(false);
      setEditingParent(null);

      if (isEditing) {
          const childrenToUnlink = existingChildrenIds.filter((id) => !childrenIds.includes(id));
          const childrenToLink = childrenIds.filter((id) => !existingChildrenIds.includes(id));

          const unlinkPromises = childrenToUnlink.map((student_id) =>
            unlinkMutation.mutateAsync({ parent_id: parentId, student_id })
          );

          const linkPromises = childrenToLink.map((student_id) =>
            linkMutation.mutateAsync({ parent_id: parentId, student_id })
          );
          
          Promise.allSettled([...unlinkPromises, ...linkPromises]).catch((e) => {
              console.error("Background link/unlink failed:", e);
          });
      } else if (childrenIds.length > 0) {
          const linkPromises = childrenIds.map((student_id) =>
            linkMutation.mutateAsync({ parent_id: parentId, student_id })
          );
          
          Promise.allSettled(linkPromises).catch((e) => {
              console.error("Background link failed during creation:", e);
          });
      }
      
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setApiFormError(errorMessage);
      toast.error(errorMessage);
      throw err; 
    }
  };

  const handleUnlinkChild = async (studentId: number) => {
    if (!viewingParent) return;

    try {
      await unlinkMutation.mutateAsync({
        parent_id: viewingParent.id,
        student_id: studentId,
      });

      toast.success(`تم إلغاء ارتباط الطالب بنجاح.`);

      setViewingParent((prev) =>
        prev
          ? {
              ...prev,
              children: prev.children?.filter((c) => c.student_id !== studentId) ?? [],
            }
          : prev
      );
      
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      toast.error(errorMessage);
      console.error(err);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const columns: Column<ParentDetails>[] = [
    { key: "id", title: "#", sortable: true },
    {
      key: "full_name",
      title: "الاسم",
      sortable: true,
      render: (_, r) => r.user?.full_name || "-",
    },
    {
      key: "email",
      title: "البريد الإلكتروني",
      sortable: true,
      render: (_, r) => r.user?.email || "-",
    },
    {
      key: "phone",
      title: "الهاتف",
      sortable: true,
      render: (_, r) => <span dir="ltr">{r.user?.phone ?? "-"}</span>,
    },
    {
      key: "children_count",
      title: "عدد الأبناء",
      render: (_, r) => r.children?.length ?? 0,
    },
    {
      key: "status",
      title: "الحالة",
      sortable: true,
      render: (_, r) => { 
        const rawStatus = (r.user?.status || r.status) as ParentStatus | undefined;
        const statusValue = String(rawStatus ?? ParentStatus.PENDING).toLowerCase(); 
        let classes = "bg-gray-100 text-gray-800";
        let label = "غير محدد";

        switch (statusValue) {
          case ParentStatus.ACTIVE:
            classes = "bg-green-100 text-green-800";
            label = "نشط";
            break;
          case ParentStatus.PENDING:
            classes = "bg-yellow-100 text-yellow-800";
            label = "معلق";
            break;
          case ParentStatus.DEACTIVE:
            classes = "bg-gray-100 text-gray-800";
            label = "مغلق";
            break;
          case ParentStatus.REJECTED:
            classes = "bg-red-100 text-red-800";
            label = "مرفوض";
            break;
          default:
            classes = "bg-gray-100 text-gray-800";
            label = "غير محدد";
            break;
        }

        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${classes}`}
          >
            {label}
          </span>
        );
      },
    },
  ];

  type ParentModalInitialData = {
    id: number;
    occupation?: string | null;
    address?: string | null;
    relationship_type: RelationshipType;
    status: ParentStatus;
    user: {
      full_name: string;
      email: string;
      phone?: string | null;
    };
    children?: ParentChildInfo[];
  };

  const mapParentForModal = (p: ParentDetails): ParentModalInitialData => ({
    id: p.id,
    occupation: p.occupation ?? null,
    address: p.address ?? null,
    relationship_type: p.relationship_type,
    status: ((p.user?.status || p.status)?.toLowerCase() as ParentStatus) || ParentStatus.PENDING,
    user: {
      full_name: p.user.full_name || "",
      email: p.user.email || "",
      phone: p.user.phone ?? null,
    },
    children:
      p.children?.map((c) => ({
        student_id: c.student_id,
        full_name: c.full_name,
        email: c.email,
      })) ?? [],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <DataGrid<ParentDetails>
        title="ادارة أولياء الأمور"
        columns={columns}
        data={parents}
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
        onAddNew={handleAdd}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        addButtonText="اضافة ولي أمر"
        entityName="ولي أمر"
        searchPlaceholder="ابحث باسم أو بريد ولي الأمر..."
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        viewPermission={PermissionKeys.SYSTEM_PARENTS_VIEW}
        addPermission={PermissionKeys.SYSTEM_PARENTS_ADD}
        editPermission={PermissionKeys.SYSTEM_PARENTS_EDIT}
        deletePermission={PermissionKeys.SYSTEM_PARENTS_DELETE}
        // linkPermission ={PermissionKeys.SYSTEM_PARENTS_LINK_CHILD}
        // unlinkPermission={PermissionKeys.SYSTEM_PARENTS_UNLINK_CHILD}
        enableSearch
      />

      {isFormOpen && (
        <ParentFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingParent(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingParent ? mapParentForModal(editingParent) : undefined}
          isEditing={!!editingParent}
          isSubmitting={isSubmitting}
          apiError={apiFormError}
        />
      )}

      {isDeleteOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeletingParent(null);
          }}
          onConfirm={handleConfirmDelete}
          title="تعطيل ولي الأمر (إجراء الحذف)"
          description={`هل أنت متأكد أنك تريد تعطيل ولي الأمر ${deletingParent?.user?.full_name}؟ سيتم تعيين حالته إلى 'مغلق'. لن يتم التعطيل إذا كان لديه أبناء بحالة 'نشط'.`}
          itemName={deletingParent?.user?.full_name}
          isDeleting={updateMutation.isPending}
        />
      )}

      {isDetailsOpen && viewingParent && (
        <ParentDetailsModal
          isOpen={isDetailsOpen}
          onClose={() => {
            setIsDetailsOpen(false);
            setViewingParent(null);
          }}
          parent={viewingParent}
          onUnlink={handleUnlinkChild}
        />
      )}
    </div>
  );
};

export default ParentsGridPage;