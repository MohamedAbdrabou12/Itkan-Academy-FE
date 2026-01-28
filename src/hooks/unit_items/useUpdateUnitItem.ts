import apiReq from "@/services/apiReq";
import type { UnitItemFormData } from "@/validation/unitItemSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUnitItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UnitItemFormData & { id: number }) => {
      const response = await apiReq("PUT", `/unit-items/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
