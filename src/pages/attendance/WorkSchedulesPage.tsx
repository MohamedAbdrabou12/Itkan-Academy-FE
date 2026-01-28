import PermissionGate from "@/components/auth/PermissionGate";
import HookFormInput from "@/components/forms/HookFormInput";
import HookFormSelect from "@/components/forms/HookFormSelect";
import { PermissionKeys } from "@/constants/permissions";
import { useCreateWorkSchedule } from "@/hooks/attendance/useCreateWorkSchedule";
import { useDeleteWorkSchedule } from "@/hooks/attendance/useDeleteWorkSchedule";
import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useGetWorkSchedules } from "@/hooks/attendance/useGetWorkSchedules";
import { useUpdateWorkSchedule } from "@/hooks/attendance/useUpdateWorkSchedule";
import { useGetBranchStaff } from "@/hooks/branches/useGetBranchStaff";
import { useAuthStore } from "@/stores/auth";
import type {
  StaffWorkSchedule,
  StaffWorkScheduleCreate,
} from "@/types/attendance";
import { getLocalTime, getUTCTime } from "@/utils/formatTime";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { FormProvider, useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

const formatTime12h = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(hours, minutes);
  const period = date.getHours() >= 12 ? "م" : "ص";
  const displayHours = date.getHours() % 12 || 12;
  return `${displayHours}:${date.getMinutes().toString().padStart(2, "0")} ${period}`;
};

export default function WorkSchedulesPage() {
  const { activeBranch } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [selectedCalendarId, setSelectedCalendarId] = useState<
    number | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] =
    useState<StaffWorkSchedule | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<number | null>(null);

  const { staff } = useGetBranchStaff();
  const { calendars } = useGetCalendars({
    branch_id: activeBranch?.id ? Number(activeBranch.id) : undefined,
  });
  const { schedules, refetch } = useGetWorkSchedules({
    user_id: selectedUserId,
    calendar_id: selectedCalendarId,
  });
  const { mutate: createSchedule, isPending: isCreating } =
    useCreateWorkSchedule();
  const { mutate: updateSchedule, isPending: isUpdating } =
    useUpdateWorkSchedule();
  const { mutate: deleteSchedule } = useDeleteWorkSchedule();

  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (schedule: StaffWorkSchedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleSubmitSchedule = async (data: StaffWorkScheduleCreate) => {
    // change all times from local time to UTC time
    data.start_time = getUTCTime(data.start_time);
    data.end_time = getUTCTime(data.end_time);
    if (editingSchedule) {
      updateSchedule({ id: editingSchedule.id, data });
    } else {
      createSchedule(data);
    }
    setIsModalOpen(false);
    setEditingSchedule(null);
    refetch();
  };

  const handleDeleteSchedule = (id: number) => {
    setScheduleToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (scheduleToDelete) {
      deleteSchedule(scheduleToDelete, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setScheduleToDelete(null);
          refetch();
        },
      });
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">جداول العمل</h1>
          <p className="mt-1 text-sm text-gray-600">إدارة جداول عمل الموظفين</p>
        </div>
        <PermissionGate
          permissions={[PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE]}
        >
          <button onClick={handleOpenCreateModal} className="btn-primary">
            إضافة جدول عمل جديد
          </button>
        </PermissionGate>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            الموظف
          </label>
          <select
            value={selectedUserId || ""}
            onChange={(e) =>
              setSelectedUserId(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="select select-success w-full "
          >
            <option value="">جميع الموظفين</option>
            {staff.map((s: { id: number; full_name: string }) => (
              <option key={s.id} value={s.id}>
                {s.full_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            التقويم
          </label>
          <select
            value={selectedCalendarId || ""}
            onChange={(e) =>
              setSelectedCalendarId(
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
            className="select select-success w-full"
          >
            <option value="">جميع التقاويم</option>
            {calendars.map((c: { id: number; name: string }) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {schedules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-gray-50 font-medium text-gray-700">
                <tr>
                  <th className="px-6 py-4">الموظف</th>
                  <th className="px-6 py-4">التقويم</th>
                  <th className="px-6 py-4">وقت البداية</th>
                  <th className="px-6 py-4">وقت النهاية</th>
                  <th className="px-6 py-4">دقائق السماح</th>
                  <th className="px-6 py-4">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {schedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {schedule.user?.full_name || `موظف #${schedule.user_id}`}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {schedule.calendar?.name ||
                        `تقويم #${schedule.calendar_id}`}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {formatTime12h(schedule.start_time)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {formatTime12h(schedule.end_time)}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {schedule.grace_minutes} دقيقة
                    </td>
                    <td className="px-6 py-4">
                      <PermissionGate
                        permissions={[
                          PermissionKeys.STAFF_ATTENDANCE_CALENDAR_MANAGE,
                        ]}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEditModal(schedule)}
                            className="text-blue-600 hover:text-blue-800"
                            title="تعديل"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(schedule.id)}
                            className="text-red-600 hover:text-red-800"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </PermissionGate>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-gray-500">
            لا توجد جداول عمل مطابقة للفلتر المحدد
          </div>
        )}
      </div>

      {isModalOpen && (
        <WorkScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitSchedule}
          isSubmitting={isCreating || isUpdating}
          staff={staff}
          calendars={calendars}
          initialData={editingSchedule || undefined}
        />
      )}

      {isDeleteModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="text-lg font-bold text-gray-800">حذف جدول العمل</h3>
            <p className="py-4 text-gray-600">
              هل أنت متأكد من حذف جدول العمل هذا؟ لا يمكن التراجع عن هذا
              الإجراء.
            </p>
            <div className="modal-action">
              <button
                className="btn border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setScheduleToDelete(null);
                }}
              >
                إلغاء
              </button>
              <button
                className="btn btn-error text-white"
                onClick={confirmDelete}
              >
                حذف
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop bg-black/40"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setScheduleToDelete(null);
            }}
          />
        </div>
      )}
    </div>
  );
}

interface WorkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffWorkScheduleCreate) => void;
  isSubmitting: boolean;
  staff: Array<{ id: number; full_name: string }>;
  calendars: Array<{ id: number; name: string }>;
  initialData?: StaffWorkSchedule;
}

function WorkScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  staff,
  calendars,
  initialData,
}: WorkScheduleModalProps) {
  const workScheduleSchema = z.object({
    user_id: z.string().min(1, "الموظف مطلوب"),
    calendar_id: z.string().min(1, "التقويم مطلوب"),
    start_time: z.string().min(1, "وقت غير صالح"),
    end_time: z.string().min(1, "وقت غير صالح"),
    grace_minutes: z.coerce
      .number()
      .min(0, "يجب أن تكون دقائق السماح >= 0")
      .max(1440)
      .optional(),
  });

  type WorkScheduleForm = z.infer<typeof workScheduleSchema>;

  const methods = useForm<WorkScheduleForm>({
    resolver: zodResolver(
      workScheduleSchema,
    ) as unknown as Resolver<WorkScheduleForm>,
    defaultValues: {
      user_id: `${initialData?.user_id}` || "",
      calendar_id: `${initialData?.calendar_id}` || "",
      start_time: initialData?.start_time
        ? getLocalTime(initialData?.start_time)
        : "09:00",
      end_time: initialData?.end_time
        ? getLocalTime(initialData?.end_time)
        : "17:00",
      grace_minutes: initialData?.grace_minutes ?? 15,
    },
  });

  const { handleSubmit } = methods;

  if (!isOpen) return null;

  const internalSubmit = (data: WorkScheduleForm) => {
    // cast to the backend payload type expected by parent
    onSubmit(data as unknown as StaffWorkScheduleCreate);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {initialData ? "تعديل جدول عمل" : "إضافة جدول عمل جديد"}
        </h3>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(internalSubmit)} className="space-y-4">
            <HookFormSelect
              label="الموظف"
              name="user_id"
              required
              disabled={!!initialData}
              options={staff.map((s) => ({
                value: `${s.id}`,
                label: s.full_name,
              }))}
            />

            <HookFormSelect
              label="التقويم"
              name="calendar_id"
              required
              options={calendars.map((c) => ({
                value: `${c.id}`,
                label: c.name,
              }))}
            />

            <HookFormInput
              label="وقت البداية"
              name="start_time"
              type="time"
              required
            />

            <HookFormInput
              label="وقت النهاية"
              name="end_time"
              type="time"
              required
            />

            <HookFormInput
              label="دقائق السماح"
              name="grace_minutes"
              type="number"
            />

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
                    ? "تحديث"
                    : "إنشاء"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
