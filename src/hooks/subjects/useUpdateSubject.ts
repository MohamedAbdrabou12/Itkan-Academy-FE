import apiReq from "@/services/apiReq";
import type { SubjectFormData } from "@/validation/subjectSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: SubjectFormData & { id: number }) => {
      const response = await apiReq("PUT", `/subjects/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects"] });
    },
  });
};
