import { usePermissionsGate } from "@/hooks/auth/usePermissionGate";
import { useAuthStore } from "@/stores/auth";
import { Navigate, Outlet, useLocation } from "react-router";

export default function PermissionBasedRoute() {
  const { user } = useAuthStore();

  const { canAccessRoute } = usePermissionsGate();

  const location = useLocation();

  if (!user) return <Navigate to="/login" replace />;

  const canAccess = canAccessRoute(location.pathname);

  if (!canAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
