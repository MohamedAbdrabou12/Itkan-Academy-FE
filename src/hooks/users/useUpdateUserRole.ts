import apiReq from "@/services/apiReq";
import type { UpdateUserRoleData } from "@/types/Roles";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  const {
    mutate: updateUserRole,
    isPending,
    error,
  } = useMutation({
    mutationFn: async (updateData: UpdateUserRoleData) => {
      return await apiReq("PATCH", "/users/role", updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { updateUserRole, isPending, error };
};
