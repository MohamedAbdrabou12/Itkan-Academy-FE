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
import { useGetCalendars } from "@/hooks/attendance/useGetCalendars";
import { useGetWorkingDays } from "@/hooks/attendance/useGetWorkingDays";
import { useGetHolidays } from "@/hooks/attendance/useGetHolidays";

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

  const { calendars } = useGetCalendars({
    branch_id,
    is_active: true,
  });

  const activeCalendar = calendars[0];

  const { workingDays } = useGetWorkingDays(activeCalendar?.id);
  const { holidays } = useGetHolidays(activeCalendar?.id);

  const { attendance, isPending } = useGetDailyAttendance({
    user_id,
    branch_id,
  });

  const getAttendanceForDate = (date: Date): AttendanceDaily | undefined => {
    const dateStr = format(date, "yyyy-MM-dd");
    return attendance.find((a) => a.date === dateStr);
  };

  const getDayDetails = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const holiday = holidays.find((h) => h.date === dateStr);
    if (holiday)
      return { type: "holiday", name: holiday.name, is_paid: holiday.is_paid };

    const weekdayMap: Record<number, string> = {
      1: "mon",
      2: "tue",
      3: "wed",
      4: "thu",
      5: "fri",
      6: "sat",
      0: "sun",
    };
    const dayName = weekdayMap[date.getDay()];
    const workingDay = workingDays.find((wd) => wd.weekday === dayName);

    if (workingDay && !workingDay.is_working) return { type: "weekend" };
    return { type: "working" };
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
          const dayDetails = getDayDetails(day);
          const isCurrentDay = isToday(day);
          const isCurrentMonth = isSameMonth(day, currentDate);

          return (
            <div
              key={day.toISOString()}
              className={`relative flex h-16 flex-col items-center justify-center rounded-lg border p-1 ${
                isCurrentDay
                  ? "border-emerald-500 bg-emerald-50"
                  : dayDetails.type === "holiday" && dayDetails.is_paid
                    ? "border-blue-300 bg-blue-100"
                    : dayDetails.type === "holiday" && !dayDetails.is_paid
                      ? "border-purple-300 bg-purple-100"
                      : dayDetails.type === "weekend"
                        ? "border-gray-200 bg-gray-100"
                        : "border-gray-200 bg-white"
              } ${!isCurrentMonth ? "opacity-40" : ""}`}
            >
              <span
                className={`text-xs font-medium ${
                  isCurrentDay ? "text-emerald-700" : "text-gray-700"
                }`}
              >
                {format(day, "d")}
              </span>

              {dayDetails.type === "holiday" && (
                <span
                  className={`mt-1 line-clamp-1 text-[10px] font-bold ${
                    dayDetails.is_paid ? "text-blue-700" : "text-purple-700"
                  }`}
                >
                  {dayDetails.name}
                </span>
              )}

              {dayAttendance ? (
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${getStatusColor(
                    dayAttendance.status,
                  )}`}
                  title={dayAttendance.status}
                />
              ) : dayDetails.type === "working" &&
                day < new Date() &&
                !isCurrentDay ? (
                <div
                  className="mt-1 h-2 w-2 rounded-full bg-red-500"
                  title="absent"
                />
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap gap-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">حاضر</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <span className="text-xs text-gray-600">متأخر</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <span className="text-xs text-gray-600">غائب</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500"></div>
          <span className="text-xs text-gray-600">نصف يوم</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-blue-500"></div>
          <span className="text-xs text-gray-600">إجازة</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-blue-300 bg-blue-100"></div>
          <span className="text-xs text-gray-600">عطلة مدفوعة</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-purple-300 bg-purple-100"></div>
          <span className="text-xs text-gray-600">عطلة غير مدفوعة</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded border border-gray-200 bg-gray-100"></div>
          <span className="text-xs text-gray-600">نهاية الأسبوع</span>
        </div>
      </div>
    </div>
  );
};
