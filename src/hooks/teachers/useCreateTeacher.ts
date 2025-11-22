import apiReq from "@/services/apiReq";
import type { TeacherFormData } from "@/validation/teacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TeacherFormData) => {
      const response = await apiReq("POST", "/teachers", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
    },
  });
};
