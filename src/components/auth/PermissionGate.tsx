import { usePermissionsGate } from "@/hooks/auth/usePermissionGate";
import type { PERMISSION_VALUE } from "@/types/permissions";

export interface PermissionGateProps {
  permissions?: PERMISSION_VALUE[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function PermissionGate({
  permissions,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { can } = usePermissionsGate();
  console.log("permisis", permissions);

  return can(permissions) ? children : fallback;
}
