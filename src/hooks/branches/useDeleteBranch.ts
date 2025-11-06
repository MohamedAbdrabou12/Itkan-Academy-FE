import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiReq("DELETE", `/branches/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
