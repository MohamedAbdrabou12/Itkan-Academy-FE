import { Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import GuestOnlyRoute from "./components/auth/GuestOnlyRoute";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/NotFoundPage";
import HomePage from "./pages/student/HomePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { UserRole } from "./types/User";

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
          <Route path="/home" element={<HomePage />} />
        </Route>

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
