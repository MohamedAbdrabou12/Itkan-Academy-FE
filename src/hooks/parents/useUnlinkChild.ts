import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentDetails, ParentsResponse } from "@/types/Parents"; 

export const useUnlinkChild = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parent_id, student_id }: { parent_id: number; student_id: number }) => {
      return await apiReq("DELETE", `/parents/${parent_id}/children/${student_id}`);
    },
    onSuccess: (updated: ParentDetails) => {
      queryClient.setQueriesData<ParentsResponse>(
        { queryKey: ["parents"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((p) => (p.id === updated.id ? updated : p)),
          };
        }
      );
      queryClient.setQueryData(["parent", updated.id], updated);
    },
  });
};