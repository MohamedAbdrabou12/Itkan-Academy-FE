import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentUpdateForm } from "@/validation/parentSchema";
import type { ParentDetails, ParentsResponse } from "@/types/Parents";

export const useUpdateParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parent_id, ...data }: ParentUpdateForm & { parent_id: number }) => {
      return await apiReq("PUT", `/parents/${parent_id}`, data);
    },
    onSuccess: (updatedParent: ParentDetails) => {
      queryClient.setQueriesData<ParentsResponse>(
        { queryKey: ["parents"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: oldData.items.map((p) => (p.id === updatedParent.id ? updatedParent : p)),
          };
        }
      );
      queryClient.setQueryData(["parent", updatedParent.id], updatedParent);
    },
  });
};