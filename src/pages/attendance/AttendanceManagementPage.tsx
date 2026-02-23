import { useGetDailyAttendance } from "@/hooks/attendance/useGetDailyAttendance";
import { useGetBranchStaff } from "@/hooks/branches/useGetBranchStaff";
import { useAuthStore } from "@/stores/auth";
import type { AttendanceDaily } from "@/types/attendance";
import { format } from "date-fns";
import { useState } from "react";

export default function AttendanceManagementPage() {
  const { activeBranch } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>();

  const { staff } = useGetBranchStaff();

  const { attendance, isPending } = useGetDailyAttendance({
    date: selectedDate,
    branch_id: activeBranch?.id ? Number(activeBranch.id) : undefined,
    user_id: selectedUserId,
  });

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; color: string }> = {
      present: { text: "حاضر", color: "bg-green-100 text-green-700" },
      late: { text: "متأخر", color: "bg-yellow-100 text-yellow-700" },
      absent: { text: "غائب", color: "bg-red-100 text-red-700" },
      half_day: { text: "نصف يوم", color: "bg-orange-100 text-orange-700" },
      on_leave: { text: "إجازة", color: "bg-blue-100 text-blue-700" },
    };

    const statusInfo = statusMap[status] || {
      text: status,
      color: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.color}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          إدارة الحضور والانصراف
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          عرض وإدارة سجلات الحضور والانصراف
        </p>
      </div>

      <div className="grid gap-6">
        <div className="">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                سجلات الحضور
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-4">
              <select
                value={selectedUserId || ""}
                onChange={(e) =>
                  setSelectedUserId(
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
                className="select select-success w-full"
              >
                <option value="">جميع الموظفين</option>
                {staff.map((s: { id: number; full_name: string }) => (
                  <option key={s.id} value={s.id}>
                    {s.full_name}
                  </option>
                ))}
              </select>
            </div>

            {isPending ? (
              <div className="flex items-center justify-center p-8">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
              </div>
            ) : attendance.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                لا توجد سجلات حضور لهذا اليوم
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        الموظف
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        الحالة
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        وقت الحضور
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        وقت الخروج
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        ساعات العمل
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record: AttendanceDaily) => {
                      const user = staff.find(
                        (s: { id: number; full_name: string }) =>
                          s.id === record.user_id,
                      );
                      return (
                        <tr
                          key={record.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {user?.full_name || `User #${record.user_id}`}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(record.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {record.check_in_time?.substring(0, 8) || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {record.check_out_time?.substring(0, 8) || "-"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {record.worked_minutes
                              ? `${Math.floor(record.worked_minutes / 60)} ساعة ${record.worked_minutes % 60} دقيقة`
                              : "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
