import { useAuthStore } from "@/stores/auth";
import type { PERMISSION_VALUE } from "@/types/permissions";
import { UserRole } from "@/types/Roles";

export const usePermissionsGate = () => {
  const { getUserPermission } = useAuthStore();
  const userPermissions = getUserPermission();
  const user = useAuthStore((state) => state.user);

  const isAdmin = () => {
    if (!user) return false;

    if (user.role_name == UserRole.ADMIN) return true;
    return false;
  };

  const can = (requiredPermissions?: PERMISSION_VALUE[]): boolean => {
    if (isAdmin()) return true;
    if (!user || !userPermissions || !requiredPermissions) return false;

    for (const requiredPermission of requiredPermissions) {
      const splitedRequiredPermission = requiredPermission?.split(".");
      splitedRequiredPermission?.splice(
        splitedRequiredPermission.length - 1,
        1,
        "*",
      );

      // generic permission
      const genericPermission = splitedRequiredPermission?.join(".");

      for (const permission of userPermissions) {
        if (
          permission.code === genericPermission ||
          permission.code === requiredPermission
        )
          return true;
      }
    }

    return false;
  };

  return { can };
};
