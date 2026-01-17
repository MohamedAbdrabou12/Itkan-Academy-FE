import { useGetDailyAttendance } from "@/hooks/attendance/useGetDailyAttendance";
import type { AttendanceDaily } from "@/types/attendance";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";
import { useState } from "react";

interface AttendanceCalendarViewProps {
  user_id?: number;
  branch_id?: number;
}

export const AttendanceCalendarView = ({
  user_id,
  branch_id,
}: AttendanceCalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const { attendance, isPending } = useGetDailyAttendance({
    user_id,
    branch_id,
  });

  const getAttendanceForDate = (date: Date): AttendanceDaily | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find((a) => a.date === dateStr);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "present":
        return "bg-green-500";
      case "late":
        return "bg-yellow-500";
      case "absent":
        return "bg-red-500";
      case "half_day":
        return "bg-orange-500";
      case "on_leave":
        return "bg-blue-500";
      default:
        return "bg-gray-300";
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={goToPreviousMonth}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            السابق
          </button>
          <button
            onClick={goToNextMonth}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            التالي
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"].map(
          (day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ),
        )}

        {daysInMonth.map((day) => {
          const dayAttendance = getAttendanceForDate(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={`relative flex h-16 flex-col items-center justify-center rounded-lg border ${
                isCurrentDay
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-gray-200 bg-gray-50"
              } ${!isCurrentMonth ? "opacity-40" : ""}`}
            >
              <span
                className={`text-sm font-medium ${
                  isCurrentDay ? "text-emerald-700" : "text-gray-700"
                }`}
              >
                {format(day, "d")}
              </span>
              {dayAttendance && (
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${getStatusColor(
                    dayAttendance.status,
                  )}`}
                  title={dayAttendance.status}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-green-500"></div>
          <span className="text-sm text-gray-600">حاضر</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-yellow-500"></div>
          <span className="text-sm text-gray-600">متأخر</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-red-500"></div>
          <span className="text-sm text-gray-600">غائب</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-orange-500"></div>
          <span className="text-sm text-gray-600">نصف يوم</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-blue-500"></div>
          <span className="text-sm text-gray-600">إجازة</span>
        </div>
      </div>
    </div>
  );
};
