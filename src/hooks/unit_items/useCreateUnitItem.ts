import apiReq from "@/services/apiReq";
import type { UnitItemFormData } from "@/validation/unitItemSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUnitItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UnitItemFormData) => {
      const response = await apiReq("POST", "/unit-items", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
