import apiReq from "@/services/apiReq";
import type { BranchFormData } from "@/validation/branchSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: BranchFormData & { id: number }) => {
      const response = await apiReq("PUT", `/branches/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },
  });
};
