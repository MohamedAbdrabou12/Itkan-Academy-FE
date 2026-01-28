import apiReq from "@/services/apiReq";
import type { CurriculumFormData } from "@/validation/curriculum";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateCurriculum = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CurriculumFormData) => {
      console.log({ data });
      const response = await apiReq("POST", "/curriculums", {
        ...data,
        is_active: data.is_active,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["curriculums"] });
    },
  });
};
