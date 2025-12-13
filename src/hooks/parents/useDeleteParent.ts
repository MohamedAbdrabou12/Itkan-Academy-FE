import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentsResponse, ParentDetails } from "@/types/Parents";

export const useDeleteParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (parent_id: number) => {
      return await apiReq("DELETE", `/parents/${parent_id}`);
    },
    onSuccess: (_data, parent_id: number) => {
      queryClient.setQueryData<ParentsResponse | undefined>(["parents"], (oldData) => {
        if (!oldData) return oldData;
        const newItems = oldData.items.filter((p: ParentDetails) => p.id !== parent_id);
        return { ...oldData, items: newItems, total: oldData.total - 1 };
      });

      queryClient.removeQueries({ queryKey: ["parent", parent_id], exact: true });
    },
  });
};