import apiReq from "@/services/apiReq";
import type { CurriculumFormData } from "@/validation/curriculum";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateCurriculum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: CurriculumFormData & { id: number }) => {
      const response = await apiReq("PUT", `/curriculums/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculums"] });
    },
  });
};
