import apiReq from "@/services/apiReq";
import type { UnitFormData } from "@/validation/unitSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UnitFormData & { id: number }) => {
      const response = await apiReq("PUT", `/units/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
