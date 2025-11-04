import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import { type RoleFormData } from "@/validation/roleSchema";

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RoleFormData) => {
      const response = await apiReq("POST", "/roles", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
