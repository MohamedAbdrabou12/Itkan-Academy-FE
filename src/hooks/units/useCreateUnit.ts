import apiReq from "@/services/apiReq";
import type { UnitFormData } from "@/validation/unitSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UnitFormData) => {
      const response = await apiReq("POST", "/units", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
