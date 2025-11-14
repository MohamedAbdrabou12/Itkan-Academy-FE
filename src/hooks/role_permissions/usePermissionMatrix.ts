import type { Permission } from "@/types/permissions";
import { useEffect, useState } from "react";
import { useGetAllAvailablePermissions } from "../permissions/useGetAllAvailablePermissions";
import { useGetRolePermissions } from "./useGetRolePermissions";
import { useUpdateRolePermissions } from "./useUpdateRolePermissions";

export const usePermissionMatrix = (roleId: number) => {
  const { data: rolePermissions, isLoading: isRolePermissionsLoading } =
    useGetRolePermissions(roleId);
  const {
    permissions: availablePermissions,
    isLoading: isAvailablePermissionsLoading,
  } = useGetAllAvailablePermissions();
  const updatePermissionsMutation = useUpdateRolePermissions();

  // Local state for managing changes before saving
  const [localAssignedIds, setLocalAssignedIds] = useState<number[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const isLoading = isRolePermissionsLoading || isAvailablePermissionsLoading;

  // Initialize local state when data loads
  useEffect(() => {
    if (rolePermissions) {
      const initialIds = rolePermissions.map((rp) => rp.permission_id);
      setLocalAssignedIds(initialIds);
      setHasUnsavedChanges(false);
    }
  }, [rolePermissions]);

  // Group permissions by category, module, and action for matrix display
  const getPermissionMatrix = () => {
    const matrix: Record<
      string, // category.module
      Record<string, { permission: Permission; granted: boolean }> // action -> data
    > = {};

    const categories: Set<string> = new Set();
    const modules: Record<string, Set<string>> = {}; // category -> modules
    const actions: Record<string, Set<string>> = {}; // category.module -> actions

    availablePermissions?.forEach((permission) => {
      // Extract category, module and action from code (e.g., "academic.curriculum.view")
      const parts = permission.code.split(".");
      if (parts.length >= 2) {
        const category = parts[0];
        const module = parts[1];
        const action = parts[2] || "*";
        const moduleKey = `${category}.${module}`;

        // Build categories and modules
        categories.add(category);
        if (!modules[category]) modules[category] = new Set();
        modules[category].add(module);

        // Build actions
        if (!actions[moduleKey]) actions[moduleKey] = new Set();
        actions[moduleKey].add(action);

        // Build matrix
        if (!matrix[moduleKey]) {
          matrix[moduleKey] = {};
        }

        // Convert permission.id to number for comparison
        const permissionId =
          typeof permission.id === "string"
            ? parseInt(permission.id, 10)
            : permission.id;

        matrix[moduleKey][action] = {
          permission,
          granted: localAssignedIds.includes(permissionId),
        };
      }
    });

    return {
      matrix,
      categories: Array.from(categories),
      modules: Object.fromEntries(
        Object.entries(modules).map(([category, moduleSet]) => [
          category,
          Array.from(moduleSet),
        ]),
      ),
      actions: Object.fromEntries(
        Object.entries(actions).map(([moduleKey, actionSet]) => [
          moduleKey,
          Array.from(actionSet),
        ]),
      ),
    };
  };

  // Helper function to convert permission ID to number
  const getPermissionIdAsNumber = (permissionId: string | number): number => {
    return typeof permissionId === "string"
      ? parseInt(permissionId, 10)
      : permissionId;
  };

  // Update local state when toggling permissions (NO API CALL)
  const togglePermission = (permissionId: number, granted: boolean) => {
    setLocalAssignedIds((current) => {
      const newIds = granted
        ? [...current, permissionId]
        : current.filter((id) => id !== permissionId);

      setHasUnsavedChanges(true);
      return newIds;
    });
  };

  // Toggle all permissions for a module (NO API CALL)
  const toggleModulePermissions = (moduleKey: string, grant: boolean) => {
    const modulePermissions = availablePermissions?.filter((p) =>
      p.code.startsWith(`${moduleKey}.`),
    );

    const modulePermissionIds =
      modulePermissions?.map((p) => getPermissionIdAsNumber(p.id)) || [];

    setLocalAssignedIds((current) => {
      const newIds = grant
        ? [...new Set([...current, ...modulePermissionIds])]
        : current.filter((id) => !modulePermissionIds.includes(id));

      setHasUnsavedChanges(true);
      return newIds;
    });
  };

  // Toggle all permissions for entire role (NO API CALL)
  const toggleAllPermissions = (grant: boolean) => {
    const allPermissionIds =
      availablePermissions?.map((p) => getPermissionIdAsNumber(p.id)) || [];

    setLocalAssignedIds(grant ? allPermissionIds : []);
    setHasUnsavedChanges(true);
  };

  // Save all changes to backend (SINGLE API CALL)
  const savePermissions = async () => {
    try {
      console.log("Saving permissions:", {
        roleId,
        permissionIds: localAssignedIds,
        count: localAssignedIds.length,
      });

      const result = await updatePermissionsMutation.mutateAsync({
        roleId,
        permissionIds: localAssignedIds,
      });

      console.log("Save result:", result);
      setHasUnsavedChanges(false);
      return true;
    } catch (error) {
      console.error("Failed to save permissions:", error);
      return false;
    }
  };

  // Reset to original state
  const resetPermissions = () => {
    if (rolePermissions) {
      const originalIds = rolePermissions.map((rp) => rp.permission_id);
      setLocalAssignedIds(originalIds);
      setHasUnsavedChanges(false);
    }
  };

  const { matrix, categories, modules, actions } = getPermissionMatrix();

  return {
    // Data
    rolePermissions: rolePermissions || [],
    availablePermissions: availablePermissions || [],
    permissionMatrix: matrix,
    categories,
    modules,
    actions,
    assignedPermissionIds: localAssignedIds,

    // State
    isLoading,
    isUpdating: updatePermissionsMutation.isPending,
    hasUnsavedChanges,
    error: updatePermissionsMutation.error,

    // Methods (local state changes only)
    togglePermission,
    toggleModulePermissions,
    toggleAllPermissions,

    // Save and reset methods
    savePermissions,
    resetPermissions,
  };
};
