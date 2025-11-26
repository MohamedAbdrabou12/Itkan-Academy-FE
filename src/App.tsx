import ItkanDashboardLayout from "@/components/layouts/ItkanDashboardLayout";
import StudentLayout from "@/components/layouts/StudentLayout";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import BranchesGridPage from "@/pages/general-manager/BranchesGridPage";
import RolesGridPage from "@/pages/general-manager/RolesGridPage";
import StudentsGridPage from "@/pages/general-manager/StudentsGridPage";
import TeachersGridPage from "@/pages/general-manager/TeachersGridPage";
import UsersRoleGridPage from "@/pages/general-manager/UsersRoleGridPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AttendanceEvaluationsPage from "@/pages/staff/AttendanceEvaluationsPage";
import AboutPage from "@/pages/student/AboutPage";
import BranchesPage from "@/pages/student/BranchesPage";
import ContactPage from "@/pages/student/ContactPage";
import HomePage from "@/pages/student/HomePage";
import NewsPage from "@/pages/student/NewsPage";
import ProgramsPage from "@/pages/student/ProgramsPage";
import RegisterPendingPage from "@/pages/student/RegisterPendingPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import ClassesGridPage from "./pages/general-manager/ClassesGridPage";

const App = () => {
  return (
    <>
      <Routes>
        {/* GUEST-only routes */}
        {/* <Route element={<GuestOnlyRoute />}> */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register-pending" element={<RegisterPendingPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* </Route> */}

        {/* STUDENT-only routes */}
        {/* <Route element={<RoleBasedRoute allowedRoles={[UserRole.STUDENT]} />}> */}
        <Route element={<StudentLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/programs" element={<ProgramsPage />} />
        </Route>
        {/* </Route> */}

        <Route element={<ItkanDashboardLayout />}>
          <Route path="/itkan-dashboard" element={<>Hello</>} />
          <Route path="/itkan-dashboard/roles" element={<RolesGridPage />} />
          <Route
            path="/itkan-dashboard/branches"
            element={<BranchesGridPage />}
          />
          <Route
            path="/itkan-dashboard/users"
            element={<UsersRoleGridPage />}
          />
          <Route
            path="/itkan-dashboard/attendance-and-evaluations"
            element={<AttendanceEvaluationsPage />}
          />
          <Route
            path="/itkan-dashboard/students"
            element={<StudentsGridPage />}
          />

          <Route
            path="/itkan-dashboard/teachers"
            element={<TeachersGridPage />}
          />

          <Route
            path="/itkan-dashboard/classes"
            element={<ClassesGridPage />}
          />
        </Route>

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Notfound route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="top-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={false}
        rtl={false}
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
