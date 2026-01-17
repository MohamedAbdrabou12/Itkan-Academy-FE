import PermissionGate from "@/components/auth/PermissionGate";
import { PermissionKeys } from "@/constants/permissions";
import { useCreateCalendar } from "@/hooks/attendance/useCreateCalendar";
import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useAuthStore } from "@/stores/auth";
import type { SchoolCalendar, SchoolCalendarCreate } from "@/types/attendance";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function CalendarsPage() {
  const { activeBranch } = useAuthStore();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<number | undefined>(
    activeBranch?.id ? Number(activeBranch.id) : undefined,
  );

  const { calendars, isPending, refetch } = useGetCalendars({
    branch_id: selectedBranchId || undefined,
  });
  const { branches } = useGetAllBranches({});
  const { mutate: createCalendar, isPending: isCreating } = useCreateCalendar();

  const handleCreateCalendar = async (data: SchoolCalendarCreate) => {
    createCalendar(data);
    setIsModalOpen(false);
    refetch();
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
          <button onClick={() => setIsModalOpen(true)} className="btn-primary">
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
                {getStatusBadge(calendar.is_active)}
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">المنطقة الزمنية:</span>{" "}
                  {calendar.timezone}
                </div>
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
        <CreateCalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleCreateCalendar}
          isSubmitting={isCreating}
          branches={branches}
        />
      )}
    </div>
  );
}

interface CreateCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SchoolCalendarCreate) => void;
  isSubmitting: boolean;
  branches: Array<{ id: number; name: string }>;
}

function CreateCalendarModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  branches,
}: CreateCalendarModalProps) {
  const [formData, setFormData] = useState<SchoolCalendarCreate>({
    branch_id: branches[0]?.id || 0,
    name: "",
    timezone: "UTC",
    is_active: true,
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
          إضافة تقويم جديد
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              الفرع <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.branch_id}
              onChange={(e) =>
                setFormData({ ...formData, branch_id: Number(e.target.value) })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            >
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              اسم التقويم <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              المنطقة الزمنية
            </label>
            <input
              type="text"
              value={formData.timezone}
              onChange={(e) =>
                setFormData({ ...formData, timezone: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="UTC"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) =>
                setFormData({ ...formData, is_active: e.target.checked })
              }
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
              {isSubmitting ? "جاري الحفظ..." : "إنشاء"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
