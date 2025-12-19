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
      queryClient.setQueriesData<ParentsResponse>(
        { queryKey: ["parents"] },
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            items: [created, ...oldData.items],
            total: oldData.total + 1,
          };
        }
      );
      queryClient.setQueryData(["parent", created.id], created);
      queryClient.invalidateQueries({ queryKey: ["parents"], refetchType: "none" });
    },
  });
};