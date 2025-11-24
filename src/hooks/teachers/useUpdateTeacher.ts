import apiReq from "@/services/apiReq";
import type { TeacherFormData } from "@/validation/teacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateTeacher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: TeacherFormData & { id: number }) => {
      const response = await apiReq("PUT", `/teachers/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("تم تعديل المعلم بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
