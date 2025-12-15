import apiReq from "@/services/apiReq";
import type { ExamCreate } from "@/types/exams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExamCreate) => {
      const response = await apiReq("POST", "/exams", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("تم إضافة الامتحان بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
