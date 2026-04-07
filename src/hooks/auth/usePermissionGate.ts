import { dashboardRouting } from "@/constants/dashboardRouting";
import type { Permission } from "@/types/auth";
import type { PERMISSION_VALUE } from "@/types/permissions";
import { UserRole } from "@/types/Roles";
import { useGetMe } from "./useGetMe";

export const usePermissionsGate = () => {
  const { me } = useGetMe();
  const user = me;

  const isAdmin = () => {
    if (!user) return false;

    if (user.role_name == UserRole.ADMIN) return true;
    return false;
  };

  const can = (
    requiredPermissions?: PERMISSION_VALUE[],
    userPermissions?: Permission[],
  ): boolean => {
    if (isAdmin()) return true;

    if (!userPermissions) userPermissions = user?.permissions;

    if (!user || !userPermissions || !requiredPermissions) return false;
    if (requiredPermissions.length === 0) return true;

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

  const canAccessRoute = (path: string, userPermissions?: Permission[]) => {
    const routeInfo = dashboardRouting.find((route) => route.route === path);

    const allowedRolesAllowed =
      user && routeInfo?.allowedRoles
        ? routeInfo.allowedRoles.includes(user.role_name)
        : true;

    const disallowedRolesAllowed =
      user && routeInfo?.disallowedRoles
        ? !routeInfo.disallowedRoles.includes(user.role_name)
        : true;

    const permissionsAllowed = routeInfo?.requiredPermissions
      ? can(routeInfo.requiredPermissions, userPermissions)
      : true;

    return allowedRolesAllowed && disallowedRolesAllowed && permissionsAllowed;
  };

  const getDashboardRoute = (userPermissions: Permission[]) => {
    for (const entry of dashboardRouting) {
      if (canAccessRoute(entry.route, userPermissions)) {
        return entry.route;
      }
    }
    return "/";
  };

  return { can, canAccessRoute, getDashboardRoute };
};
