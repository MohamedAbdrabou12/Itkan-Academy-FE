import apiReq from "@/services/apiReq";
import type { RoleFormData } from "@/validation/roleSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: RoleFormData & { id: number }) => {
      const response = await apiReq("PUT", `/roles/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
