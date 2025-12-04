import { dashboardRouting } from "@/constants/dashboardRouting";
import { useAuthStore } from "@/stores/auth";
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

  const can = (requiredPermission: string): boolean => {
    if (isAdmin()) return true;
    if (!user || !userPermissions) return false;

    const splitedRequiredPermission = requiredPermission.split(".");
    splitedRequiredPermission.splice(
      splitedRequiredPermission.length - 1,
      1,
      "*",
    );

    // generic permission
    const genericPermission = splitedRequiredPermission.join(".");

    for (const permission of userPermissions) {
      if (
        permission.code == genericPermission ||
        permission.code == requiredPermission
      )
        return true;
    }
    return false;
  };

  const canAccessRoute = (path: string) => {
    const requiredPermisssion = dashboardRouting.find(
      (route) => route.route === path,
    )?.permission;

    const canAccess = requiredPermisssion ? can(requiredPermisssion) : true;
    return canAccess;
  };

  const getDashboardRoute = (userPermissions: string[]) => {
    for (const entry of dashboardRouting) {
      const requiredPermisssion = entry.permission;
      const splitedRequiredPermission = requiredPermisssion.split(".");
      splitedRequiredPermission.splice(
        splitedRequiredPermission.length - 1,
        1,
        "*",
      );
      const genericPermission = splitedRequiredPermission.join(".");

      if (
        userPermissions.includes(requiredPermisssion) ||
        userPermissions.includes(genericPermission)
      ) {
        return entry.route;
      }
    }
    return "/";
  };

  return { can, canAccessRoute, getDashboardRoute };
};
