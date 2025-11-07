import GuestOnlyRoute from "@/components/auth/GuestOnlyRoute";
import RoleBasedRoute from "@/components/auth/RoleBasedRoute";
import StudentLayout from "@/components/layouts/StudentLayout";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardRouterPage from "@/pages/dashboards/DashboardRouter";
import GeneralManagerDashboardPage from "@/pages/dashboards/GeneralManagerDashboard";
import StudentDashboardPage from "@/pages/dashboards/StudentDashboard";
import TeacherDashboardPage from "@/pages/dashboards/TeacherDashboard";
import BranchesGridPage from "@/pages/general-manager/BranchesGridPage";
import RolesGridPage from "@/pages/general-manager/RolesGridPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AboutPage from "@/pages/student/AboutPage";
import BranchesPage from "@/pages/student/BranchesPage";
import ContactPage from "@/pages/student/ContactPage";
import HomePage from "@/pages/student/HomePage";
import NewsPage from "@/pages/student/NewsPage";
import ProgramsPage from "@/pages/student/ProgramsPage";
import UnauthorizedPage from "@/pages/UnauthorizedPage";
import { UserRole } from "@/types/Roles";
import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      <Routes>
        {/* GUEST-only routes */}
        <Route element={<GuestOnlyRoute />}>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* STUDENT-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={[UserRole.STUDENT]} />}>
          <Route element={<StudentLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/branches" element={<BranchesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/programs" element={<ProgramsPage />} />
          </Route>
        </Route>

        {/* General-Manager-only routes */}
        <Route
          element={<RoleBasedRoute allowedRoles={[UserRole.GENERAL_MANAGER]} />}
        >
          <Route path="/roles-grid" element={<RolesGridPage />} />
          <Route path="/branches-grid" element={<BranchesGridPage />} />
        </Route>

        {/* DASHBOARD routes */}
        <Route path="/dashboard" element={<DashboardRouterPage />} />
        <Route
          path="/dashboard/general-manager"
          element={<GeneralManagerDashboardPage />}
        />
        <Route path="/dashboard/teacher" element={<TeacherDashboardPage />} />
        <Route path="/dashboard/student" element={<StudentDashboardPage />} />

        {/* Unauthorized route */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Notfound route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer
        position="top-right"
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
