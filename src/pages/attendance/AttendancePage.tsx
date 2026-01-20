import { CheckInOutButton } from "@/components/attendance/CheckInOutButton";
import { AttendanceCalendarView } from "@/components/attendance/AttendanceCalendarView";
import { useAuthStore } from "@/stores/auth";

export default function AttendancePage() {
  const { user, activeBranch } = useAuthStore();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">الحضور والانصراف</h1>
        <p className="mt-1 text-sm text-gray-600">سجل حضورك وانصرافك اليومي</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <CheckInOutButton />
        </div>
        <div>
          <AttendanceCalendarView
            user_id={user?.id}
            branch_id={activeBranch?.id ? Number(activeBranch.id) : undefined}
          />
        </div>
      </div>
    </div>
  );
}
