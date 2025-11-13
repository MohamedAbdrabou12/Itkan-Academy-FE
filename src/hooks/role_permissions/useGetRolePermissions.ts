import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { Permission } from "@/types/permissions";
import type { RolePermission } from "@/types/permissions";

export interface PermissionResponse {
  permissions: Permission[];
}

// Get all permissions for a specific role
export const useGetRolePermissions = (roleId: number) => {
  return useQuery<RolePermission[]>({
    queryKey: ["role-permissions", roleId],
    queryFn: async () => {
      if (!roleId) throw new Error("Role ID is required");

      const response = await apiReq("GET", `/roles/${roleId}/permissions`);
      return response;
    },
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
