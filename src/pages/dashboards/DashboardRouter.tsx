import { useGetMe } from "@/hooks/auth/useGetMe";
import { Navigate } from "react-router";
import GeneralManagerDashboardPage from "./GeneralManagerDashboard";
import StudentDashboardPage from "./StudentDashboard";
import TeacherDashboardPage from "./TeacherDashboard";

export default function DashboardRouterPage() {
  const { me, isPending } = useGetMe();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!me) {
    return <Navigate to="/login" />;
  }

  switch (me.role) {
    case "student":
    case "guardian":
      return <StudentDashboardPage />;
    case "teacher":
      return <TeacherDashboardPage />;
    case "general_manager":
    case "administrative_manager":
    case "academic_manager":
    case "student_affairs_manager":
    case "hr_manager":
    case "financial_manager":
    case "general_supervisor":
    case "branch_supervisor":
      return <GeneralManagerDashboardPage />;
    default:
      return <Navigate to="/" />;
  }
}
