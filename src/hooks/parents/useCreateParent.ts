import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentCreateForm } from "@/validation/parentSchema";
import type { ParentDetails, ParentsResponse } from "@/types/Parents";

export const useCreateParent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ParentCreateForm) => {
      return await apiReq("POST", "/parents/", payload);
    },
    onSuccess: (created: ParentDetails) => {
      queryClient.setQueryData<ParentsResponse | undefined>(["parents"], (oldData) => {
        if (!oldData) return { items: [created], total: 1, page: 1, size: 10, pages: 1 };
        return {
          ...oldData,
          items: [created, ...oldData.items],
          total: oldData.total + 1,
        };
      });

      queryClient.setQueryData<ParentDetails>(["parent", created.id], created);
    },
  });
};