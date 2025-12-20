import { useGetMe } from "@/hooks/auth/useGetMe";
import { usePermissionsGate } from "@/hooks/auth/usePermissionGate";
import { Navigate, Outlet, useLocation } from "react-router";

export default function PermissionBasedRoute() {
  const { me, isPending } = useGetMe();
  const user = me;
  const { canAccessRoute } = usePermissionsGate();

  const location = useLocation();
  if (isPending) return null;

  if (!user) return <Navigate to="/login" replace />;

  const canAccess = canAccessRoute(location.pathname);

  if (!canAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
