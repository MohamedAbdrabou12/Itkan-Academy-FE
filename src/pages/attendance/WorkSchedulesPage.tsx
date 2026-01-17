import { useGetAllStaff } from "@/hooks/staff/useGetStaff";
import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useGetWorkSchedule } from "@/hooks/attendance/useGetWorkSchedule";
import { useCreateWorkSchedule } from "@/hooks/attendance/useCreateWorkSchedule";
import type { StaffWorkScheduleCreate } from "@/types/attendance";
import { useState } from "react";
import PermissionGate from "@/components/auth/PermissionGate";
import { PermissionKeys } from "@/constants/permissions";
import { useAuthStore } from "@/stores/auth";

export default function WorkSchedulesPage() {
  const { activeBranch } = useAuthStore();
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();
  const [selectedCalendarId, setSelectedCalendarId] = useState<
    number | undefined
  >();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { staff } = useGetAllStaff({});
  const { calendars } = useGetCalendars({ branch_id: activeBranch?.id });
  const { schedule, refetch } = useGetWorkSchedule({
    user_id: selectedUserId || 0,
    calendar_id: selectedCalendarId,
  });
  const { mutate: createSchedule, isPending: isCreating } =
    useCreateWorkSchedule();

  const handleCreateSchedule = async (data: StaffWorkScheduleCreate) => {
    createSchedule(data);
    setIsModalOpen(false);
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
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
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
            <option value="">اختر موظف</option>
            {staff.map((s) => (
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
            <option value="">اختر تقويم</option>
            {calendars.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedUserId && selectedCalendarId && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {schedule ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                جدول العمل الحالي
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm text-gray-500">وقت البداية</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {schedule.start_time}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">وقت النهاية</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {schedule.end_time}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">دقائق السماح</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {schedule.grace_minutes} دقيقة
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              لا يوجد جدول عمل محدد لهذا الموظف والتقويم
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <CreateWorkScheduleModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateSchedule}
          isSubmitting={isCreating}
          staff={staff}
          calendars={calendars}
        />
      )}
    </div>
  );
}

interface CreateWorkScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StaffWorkScheduleCreate) => void;
  isSubmitting: boolean;
  staff: Array<{ id: number; full_name: string }>;
  calendars: Array<{ id: number; name: string }>;
}

function CreateWorkScheduleModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  staff,
  calendars,
}: CreateWorkScheduleModalProps) {
  const [formData, setFormData] = useState<StaffWorkScheduleCreate>({
    user_id: staff[0]?.id || 0,
    calendar_id: calendars[0]?.id || 0,
    start_time: "09:00",
    end_time: "17:00",
    grace_minutes: 15,
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
          إضافة جدول عمل جديد
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
            >
              {staff.map((s) => (
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
              {calendars.map((c) => (
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
              {isSubmitting ? "جاري الحفظ..." : "إنشاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
