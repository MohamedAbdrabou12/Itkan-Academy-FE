import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentUpdateForm } from "@/validation/parentSchema";
import type { ParentsResponse, ParentDetails } from "@/types/Parents";

export const useUpdateParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ parent_id, ...data }: ParentUpdateForm & { parent_id: number }) => {
      return await apiReq("PUT", `/parents/${parent_id}`, data);
    },
    onSuccess: (updatedParent: ParentDetails) => {
      // Manual/Optimistic update for immediate UI refresh
      queryClient.setQueriesData<ParentsResponse>(
        { queryKey: ["parents"] },
        (oldData) => {
          if (!oldData) return oldData;

          const newItems: ParentDetails[] = oldData.items.map((p) =>
            p.id === updatedParent.id 
              ? { 
                  ...p, 
                  ...updatedParent,
                  // Ensure deep merge for user data (where status/name/email usually reside)
                  user: { ...p.user, ...updatedParent.user },
                } 
              : p
          );

          return {
            ...oldData,
            items: newItems,
          };
        }
      );
      // Update individual parent cache
      queryClient.setQueryData(["parent", updatedParent.id], updatedParent);
    },
  });
};