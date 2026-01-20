import { useGetBranchStaff } from "@/hooks/branches/useGetBranchStaff";
import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useGetWorkSchedules } from "@/hooks/attendance/useGetWorkSchedules";
import { useCreateWorkSchedule } from "@/hooks/attendance/useCreateWorkSchedule";
import { useUpdateWorkSchedule } from "@/hooks/attendance/useUpdateWorkSchedule";
import type {
  StaffWorkSchedule,
  StaffWorkScheduleCreate,
} from "@/types/attendance";
import { useState } from "react";
import PermissionGate from "@/components/auth/PermissionGate";
import { PermissionKeys } from "@/constants/permissions";
import { useAuthStore } from "@/stores/auth";
import { Pencil } from "lucide-react";

const formatTime12h = (timeStr: string) => {
  if (!timeStr) return "";
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "م" : "ص";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
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

  const handleOpenCreateModal = () => {
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (schedule: StaffWorkSchedule) => {
    setEditingSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleSubmitSchedule = async (data: StaffWorkScheduleCreate) => {
    if (editingSchedule) {
      updateSchedule({ id: editingSchedule.id, data });
    } else {
      createSchedule(data);
    }
    setIsModalOpen(false);
    setEditingSchedule(null);
    refetch();
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                        <button
                          onClick={() => handleOpenEditModal(schedule)}
                          className="text-blue-600 hover:text-blue-800"
                          title="تعديل"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
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
  const [formData, setFormData] = useState<StaffWorkScheduleCreate>({
    user_id: initialData?.user_id || staff[0]?.id || 0,
    calendar_id: initialData?.calendar_id || calendars[0]?.id || 0,
    start_time: initialData?.start_time || "09:00",
    end_time: initialData?.end_time || "17:00",
    grace_minutes: initialData?.grace_minutes ?? 15,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">
          {initialData ? "تعديل جدول عمل" : "إضافة جدول عمل جديد"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الموظف <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.user_id}
              onChange={(e) =>
                setFormData({ ...formData, user_id: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
              disabled={!!initialData}
            >
              {staff.map((s: { id: number; full_name: string }) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              التقويم <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.calendar_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  calendar_id: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            >
              {calendars.map((c: { id: number; name: string }) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              وقت البداية <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.start_time}
              onChange={(e) =>
                setFormData({ ...formData, start_time: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              وقت النهاية <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={formData.end_time}
              onChange={(e) =>
                setFormData({ ...formData, end_time: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              دقائق السماح
            </label>
            <input
              type="number"
              min="0"
              max="60"
              value={formData.grace_minutes}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  grace_minutes: Number(e.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
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
              {isSubmitting ? "جاري الحفظ..." : initialData ? "تحديث" : "إنشاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
