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
      // Manual/Optimistic update for the parents list to immediately reflect the child count
      queryClient.setQueriesData<ParentsResponse>(
        { queryKey: ["parents"] },
        (oldData) => {
          if (!oldData) return oldData;

          const newItems = oldData.items.map((parent) => {
            if (parent.id === updated.id) {
              // Merge the updated parent data (including the new children array)
              return { ...parent, ...updated };
            }
            return parent;
          });

          return { ...oldData, items: newItems };
        }
      );
      
      // Update individual parent cache for immediate details modal refresh
      queryClient.setQueryData(["parent", updated.id], updated);
    },
  });
};