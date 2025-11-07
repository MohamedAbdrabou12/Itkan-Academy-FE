import { useAuthStore } from "@/stores/auth";
import { useGetPermissionModules } from "./useGetPermissionModules";
import type { Permission } from "@/types/auth";
import { UserRole } from "@/types/Roles";

export const usePermissionsGate = () => {
  const { getUserPermission } = useAuthStore();
  const userPermissions = getUserPermission();
  const user = useAuthStore((state) => state.user);

  const { permissionModules } = useGetPermissionModules();

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

  const hasPermissionInModuleGroups = (moduleGroups: string[]) => {
    if (isAdmin()) return true;
    if (!user || !userPermissions || !permissionModules) return false;

    const modulesPermissions: Permission[] = [];
    permissionModules.moduleGroups.map((moduleGroup) => {
      if (moduleGroups.includes(moduleGroup.groupName)) {
        moduleGroup.modules.map((module) => {
          modulesPermissions.push(...module.permissions);
        });
      }
    });

    const isHasPermission = userPermissions.some((permission) => {
      return modulesPermissions.some((modulePermission) => {
        return permission.id == modulePermission.id;
      });
    });
    return isHasPermission;
  };

  const hasPermisssionInModules = (module: string) => {
    if (isAdmin()) return true;
    if (!user || !userPermissions || !permissionModules) return false;

    const moduleGroupsPermissions: Permission[] = [];

    for (const moduleGroup of permissionModules.moduleGroups) {
      for (const mod of moduleGroup.modules) {
        if (mod.moduleName == module) {
          moduleGroupsPermissions.push(...mod.permissions);
        }
        break;
      }
    }

    const isHasPermission = userPermissions.some((permission) => {
      return moduleGroupsPermissions.some((modulePermission) => {
        return permission.id == modulePermission.id;
      });
    });
    return isHasPermission;
  };

  return { can, hasPermisssionInModules, hasPermissionInModuleGroups };
};
