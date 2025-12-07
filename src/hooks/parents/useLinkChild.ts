import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentDetails } from "@/types/Parents";

export const useLinkChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parent_id, student_id }: { parent_id: number; student_id: number }) => {
      return await apiReq("POST", `/parents/${parent_id}/children/${student_id}`, {});
    },
    onSuccess: (updated: ParentDetails) => {
      queryClient.invalidateQueries({ queryKey: ["parents"] });
      queryClient.setQueryData(["parent", updated.id], updated);
    },
  });
};