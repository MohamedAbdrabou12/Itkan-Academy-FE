import apiReq from "@/services/apiReq";
import type { SubjectFormData } from "@/validation/subjectSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubjectFormData) => {
      const response = await apiReq("POST", "/subjects", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
