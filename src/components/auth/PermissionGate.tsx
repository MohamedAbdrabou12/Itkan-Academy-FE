import { usePermissionsGate } from "@/hooks/auth/UsePermissionGate";

export interface PermissionGateProps {
  permission: string;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export default function PermissionGate({
  permission,
  fallback = null,
  children,
}: PermissionGateProps) {
  const { can } = usePermissionsGate();
  return can(permission) ? children : fallback;
}
