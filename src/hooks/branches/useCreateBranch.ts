import apiReq from "@/services/apiReq";
import type { BranchFormData } from "@/validation/branchSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBranch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BranchFormData) => {
      const response = await apiReq("POST", "/branches", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["branches"] });
    },
  });
};
