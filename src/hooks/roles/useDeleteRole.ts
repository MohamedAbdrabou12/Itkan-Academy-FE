import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiReq("DELETE", `/roles/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
