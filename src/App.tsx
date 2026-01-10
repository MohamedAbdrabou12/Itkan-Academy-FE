import PermissionBasedRoute from "@/components/auth/PermissionBasedRoute";
import ItkanDashboardLayout from "@/components/layouts/ItkanDashboardLayout";
import StudentLayout from "@/components/layouts/StudentLayout";
import PasswordResetSentPage from "@/hooks/auth/PasswordResetSentPage";
import ForgotPasswordPage from "@/pages/auth/ForgotPasswordPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import BranchesGridPage from "@/pages/general-manager/BranchesGridPage";
import ClassesGridPage from "@/pages/general-manager/ClassesGridPage";
import CurriculumGridPage from "@/pages/general-manager/CurriculumGridPage";
import SubjectsListPage from "@/pages/general-manager/SubjectsListPage";
import ParentsGridPage from "@/pages/general-manager/ParentsGridPage";
import ReportsPage from "@/pages/general-manager/ReportsPage";
import RolesGridPage from "@/pages/general-manager/RolesGridPage";
import StaffRoleGridPage from "@/pages/general-manager/StaffGridPage";
import StudentsGridPage from "@/pages/general-manager/StudentsGridPage";
import TeachersGridPage from "@/pages/general-manager/TeachersGridPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AttendanceEvaluationsPage from "@/pages/staff/AttendanceEvaluationsPage";
import ExamPage from "@/pages/staff/ExamPage";
import QuestionBankPage from "@/pages/staff/QuestionBankPage";
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
import SubjectContentPage from "./pages/general-manager/SubjectContentPage";

const App = () => {
  return (
    <>
      <Routes>
        {/* GUEST-only routes */}
        {/* <Route element={<GuestOnlyRoute />}> */}
        <Route path="register" element={<RegisterPage />} />
        <Route path="register-pending" element={<RegisterPendingPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="password-reset-sent"
          element={<PasswordResetSentPage />}
        />
        <Route path="login" element={<LoginPage />} />
        {/* </Route> */}

        {/* STUDENT-only routes */}
        <Route element={<PermissionBasedRoute />}>
          <Route element={<StudentLayout />}>
            <Route index element={<HomePage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="branches" element={<BranchesPage />} />
            <Route path="news" element={<NewsPage />} />
            <Route path="programs" element={<ProgramsPage />} />
          </Route>

          <Route path="itkan-dashboard" element={<ItkanDashboardLayout />}>
            <Route index element={<>Hello</>} />
            <Route path="roles" element={<RolesGridPage />} />
            <Route
              path="branches"
              element={<BranchesGridPage />}
            />
            <Route
              path="staff"
              element={<StaffRoleGridPage />}
            />
            <Route
              path="attendance-and-evaluations"
              element={<AttendanceEvaluationsPage />}
            />
            <Route path="reports" element={<ReportsPage />} />
            <Route
              path="students"
              element={<StudentsGridPage />}
            />
            <Route
              path="teachers"
              element={<TeachersGridPage />}
            />
            <Route
              path="classes"
              element={<ClassesGridPage />}
            />
            <Route
              path="parents"
              element={<ParentsGridPage />}
            />
            <Route
              path="question_bank"
              element={<QuestionBankPage />}
            />
            <Route
              path="exam_dashboard"
              element={<ExamPage />}
            />
            <Route
              path="curriculum"
              element={<CurriculumGridPage />}
            />
            <Route path="subjects">
              <Route index element={<SubjectsListPage />} />
              <Route path=":id" element={<SubjectContentPage />} />
            </Route>
          </Route>
        </Route>

        {/* Unauthorized route */}
        <Route path="unauthorized" element={<UnauthorizedPage />} />

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
