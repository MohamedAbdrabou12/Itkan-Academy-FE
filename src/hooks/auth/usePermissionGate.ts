import { dashboardRouting } from "@/constants/dashboardRouting";
import type { PERMISSION_VALUE } from "@/types/permissions";
import { UserRole } from "@/types/Roles";
import { useGetMe } from "./useGetMe";

export const usePermissionsGate = () => {
  const { me } = useGetMe();
  const user = me;
  const userPermissions = user?.permissions;

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

  const canAccessRoute = (path: string) => {
    const requiredPermisssion = dashboardRouting.find(
      (route) => route.route === path,
    )?.permission;

    const canAccess = requiredPermisssion ? can([requiredPermisssion]) : true;
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
