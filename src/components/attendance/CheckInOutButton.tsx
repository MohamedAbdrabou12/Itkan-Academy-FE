import { useCheckIn } from "@/hooks/attendance/useCheckIn";
import { useCheckOut } from "@/hooks/attendance/useCheckOut";
import { useGetDailyAttendance } from "@/hooks/attendance/useGetDailyAttendance";
import { useAuthStore } from "@/stores/auth";
import { format } from "date-fns";

export const CheckInOutButton = () => {
  const { user, activeBranch } = useAuthStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const { attendance } = useGetDailyAttendance({
    date: today,
    user_id: user?.id,
    branch_id: activeBranch?.id,
  });

  const todayAttendance = attendance[0];
  const hasCheckedIn = !!todayAttendance?.check_in_time;
  const hasCheckedOut = !!todayAttendance?.check_out_time;

  const { mutate: checkIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: checkOut, isPending: isCheckingOut } = useCheckOut();

  const handleCheckIn = () => {
    checkIn({
      source: "manual",
    });
  };

  const handleCheckOut = () => {
    checkOut({
      source: "manual",
    });
  };

  const getStatusColor = () => {
    if (!todayAttendance) return "bg-gray-100 text-gray-600";
    switch (todayAttendance.status) {
      case "present":
        return "bg-green-100 text-green-700";
      case "late":
        return "bg-yellow-100 text-yellow-700";
      case "absent":
        return "bg-red-100 text-red-700";
      case "half_day":
        return "bg-orange-100 text-orange-700";
      case "on_leave":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = () => {
    if (!todayAttendance) return "غير محدد";
    switch (todayAttendance.status) {
      case "present":
        return "حاضر";
      case "late":
        return "متأخر";
      case "absent":
        return "غائب";
      case "half_day":
        return "نصف يوم";
      case "on_leave":
        return "إجازة";
      default:
        return "غير محدد";
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800">حضور اليوم</h3>
        <p className="text-sm text-gray-500">
          {format(new Date(), "yyyy-MM-dd")}
        </p>
      </div>

      <div className="mb-4">
        <div
          className={`inline-flex rounded-lg px-3 py-1 text-sm font-medium ${getStatusColor()}`}
        >
          {getStatusText()}
        </div>
      </div>

      {todayAttendance?.check_in_time && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">وقت الحضور:</span>{" "}
          {todayAttendance.check_in_time}
        </div>
      )}

      {todayAttendance?.check_out_time && (
        <div className="mb-2 text-sm text-gray-600">
          <span className="font-medium">وقت الخروج:</span>{" "}
          {todayAttendance.check_out_time}
        </div>
      )}

      {todayAttendance?.worked_minutes && (
        <div className="mb-4 text-sm text-gray-600">
          <span className="font-medium">ساعات العمل:</span>{" "}
          {Math.floor(todayAttendance.worked_minutes / 60)} ساعة{" "}
          {todayAttendance.worked_minutes % 60} دقيقة
        </div>
      )}

      <div className="flex gap-3">
        {!hasCheckedIn && (
          <button
            onClick={handleCheckIn}
            disabled={isCheckingIn || isCheckingOut}
            className="flex-1 rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {isCheckingIn ? "جاري التسجيل..." : "تسجيل الحضور"}
          </button>
        )}

        {hasCheckedIn && !hasCheckedOut && (
          <button
            onClick={handleCheckOut}
            disabled={isCheckingIn || isCheckingOut}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
          >
            {isCheckingOut ? "جاري التسجيل..." : "تسجيل الخروج"}
          </button>
        )}

        {hasCheckedIn && hasCheckedOut && (
          <div className="flex-1 rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-600">
            تم إكمال اليوم
          </div>
        )}
      </div>
    </div>
  );
};
