import apiReq from "@/services/apiReq";
import type { TeacherFormData } from "@/validation/teacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TeacherFormData) => {
      const response = await apiReq("POST", "/teachers", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("تم إضافة المعلم بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
