import { useAuthStore } from "@/stores/auth";
import type { UserRole } from "@/types/Roles";
import { Navigate, Outlet } from "react-router";

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

export default function RoleBasedRoute({ allowedRoles }: RoleBasedRouteProps) {
  // const user = useAuthStore((state) => state.user);

  // if (!user || !allowedRoles.includes(user.role_name)) {
  //   return <Navigate to="/unauthorized" replace />;
  // }

  return <Outlet />;
}
