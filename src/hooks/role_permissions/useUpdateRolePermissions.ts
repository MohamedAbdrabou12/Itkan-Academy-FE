import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface PermissionUpdateRequest {
  permission_ids: number[];
}

export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      roleId,
      permissionIds,
    }: {
      roleId: number;
      permissionIds: number[];
    }) => {
      if (!roleId) throw new Error("Role ID is required");

      const payload: PermissionUpdateRequest = {
        permission_ids: permissionIds,
      };
      return await apiReq("POST", `/roles/${roleId}/permissions`, payload);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch role permissions
      queryClient.invalidateQueries({
        queryKey: ["role-permissions", variables.roleId],
      });

      // Also invalidate the role itself
      queryClient.invalidateQueries({
        queryKey: ["role", variables.roleId],
      });

      // Invalidate roles list
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
    },
    onError: (error) => {
      console.error("Failed to update permissions:", error);
    },
  });
};
