import PermissionGate from "@/components/auth/PermissionGate";
import HookFormInput from "@/components/forms/HookFormInput";
import HookFormSelect from "@/components/forms/HookFormSelect";
import { PermissionKeys } from "@/constants/permissions";
import { useCreateCalendar } from "@/hooks/attendance/useCreateCalendar";
import { useDeleteCalendar } from "@/hooks/attendance/useDeleteCalendar";
import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useUpdateCalendar } from "@/hooks/attendance/useUpdateCalendar";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useAuthStore } from "@/stores/auth";
import type { SchoolCalendar, SchoolCalendarCreate } from "@/types/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

export default function CalendarsPage() {
  const { activeBranch } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<SchoolCalendar | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [calendarToDelete, setCalendarToDelete] = useState<number | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(
    activeBranch?.id ? Number(activeBranch.id) : undefined,
  );

  const { calendars, isPending, refetch } = useGetCalendars({
    branch_id: selectedBranchId || undefined,
  });
  const { branches } = useGetAllBranches({});
  const { mutate: createCalendar, isPending: isCreating } = useCreateCalendar();
  const { mutate: updateCalendar, isPending: isUpdating } = useUpdateCalendar();
  const { mutate: deleteCalendar } = useDeleteCalendar();

  const branchesOptions = branches.map((branch) => ({
    value: `${branch.id}`,
    label: branch.name,
  }));

  const handleOpenCreateModal = () => {
    setEditingCalendar(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (
    e: React.MouseEvent,
    calendar: SchoolCalendar,
  ) => {
    e.stopPropagation();
    setEditingCalendar(calendar);
    setIsModalOpen(true);
  };

  const handleDeleteCalendar = (e: React.MouseEvent, calendarId: number) => {
    e.stopPropagation();
    setCalendarToDelete(calendarId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (calendarToDelete) {
      deleteCalendar(calendarToDelete, {
        onSuccess: () => {
          refetch();
          setIsDeleteModalOpen(false);
          setCalendarToDelete(null);
        },
      });
    }
  };

  const handleSubmitCalendar = async (data: SchoolCalendarCreate) => {
    if (editingCalendar) {
      updateCalendar(
        { id: editingCalendar.id, data },
        {
          onSuccess: () => {
            setIsModalOpen(false);
            setEditingCalendar(null);
            refetch();
          },
        },
      );
    } else {
      createCalendar(data, {
        onSuccess: () => {
          setIsModalOpen(false);
          refetch();
        },
      });
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
        }`}
      >
        {isActive ? "نشط" : "غير نشط"}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">إدارة التقويمات</h1>
          <p className="mt-1 text-sm text-gray-600">
            إدارة تقويمات العمل للفروع
          </p>
        </div>
        <PermissionGate
          permissions={[PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE]}
        >
          <button onClick={handleOpenCreateModal} className="btn-primary">
            إضافة تقويم جديد
          </button>
        </PermissionGate>
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          الفرع
        </label>
        <select
          value={selectedBranchId || ""}
          onChange={(e) =>
            setSelectedBranchId(
              e.target.value ? Number(e.target.value) : undefined,
            )
          }
          className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm"
        >
          <option value="">جميع الفروع</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      {isPending ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        </div>
      ) : calendars.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-gray-500">لا توجد تقويمات</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calendars.map((calendar: SchoolCalendar) => (
            <div
              key={calendar.id}
              className="cursor-pointer rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              onClick={() =>
                navigate(`/itkan-dashboard/attendance/calendars/${calendar.id}`)
              }
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {calendar.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {branches.find((b) => b.id === calendar.branch_id)?.name ||
                      `Branch #${calendar.branch_id}`}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {getStatusBadge(calendar.is_active)}
                  <PermissionGate
                    permissions={[
                      PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE,
                    ]}
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleOpenEditModal(e, calendar)}
                        className="rounded-md p-1 text-blue-600 hover:bg-blue-50"
                        title="تعديل"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCalendar(e, calendar.id)}
                        className="rounded-md p-1 text-red-600 hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </PermissionGate>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="font-medium">أيام العمل:</span>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {calendar.working_days?.filter((wd) => wd.is_working)
                      .length || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">العطل:</span>
                  <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {calendar.holidays?.length || 0}
                  </span>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(
                    `/itkan-dashboard/attendance/calendars/${calendar.id}`,
                  );
                }}
                className="mt-4 w-full rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
              >
                إدارة التقويم
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CalendarModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCalendar(null);
          }}
          onSubmit={handleSubmitCalendar}
          isSubmitting={isCreating || isUpdating}
          branches={branchesOptions}
          initialData={editingCalendar || undefined}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setCalendarToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="حذف التقويم"
          message="هل أنت متأكد من حذف هذا التقويم؟ لا يمكن التراجع عن هذا الإجراء."
        />
      )}
    </div>
  );
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SchoolCalendarCreate) => void;
  isSubmitting: boolean;
  branches: { value: string; label: string }[];
  initialData?: SchoolCalendar;
}

function CalendarModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  branches,
  initialData,
}: CalendarModalProps) {
  const calendarSchema = z.object({
    branch_id: z.string().min(1, "الفرع مطلوب"),
    name: z.string().min(1, "اسم التقويم مطلوب"),
    is_active: z.boolean(),
  });

  type CalendarForm = z.infer<typeof calendarSchema>;

  const form = useForm<CalendarForm>({
    resolver: zodResolver(calendarSchema) as unknown as Resolver<CalendarForm>,
    defaultValues: {
      branch_id: `${initialData?.branch_id}` || "",
      name: initialData?.name || "",
      is_active: initialData?.is_active ?? true,
    },
  });

  const { handleSubmit } = form;

  if (!isOpen) return null;

  const internalSubmit = (data: CalendarForm) => {
    // cast to the service payload type expected by parent
    onSubmit(data as unknown as SchoolCalendarCreate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {initialData ? "تعديل التقويم" : "إضافة تقويم جديد"}
        </h3>
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
            <HookFormSelect
              label={"الفرع"}
              name="branch_id"
              required
              disabled={!!initialData}
              options={branches}
            />

            <HookFormInput
              label="اسم التقويم"
              name="name"
              placeholder="اسم التقويم"
              type="text"
              required
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                {...form.register("is_active")}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600"
              />
              <label htmlFor="is_active" className="text-sm text-gray-700">
                نشط
              </label>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting
                  ? "جاري الحفظ..."
                  : initialData
                    ? "حفظ التغييرات"
                    : "إنشاء"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-lg">
        <h3 className="mb-2 text-lg font-bold text-gray-800">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{message}</p>

        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
}
