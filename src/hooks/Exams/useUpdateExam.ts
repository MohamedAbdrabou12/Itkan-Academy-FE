import apiReq from "@/services/apiReq";
import type { ExamCreate } from "@/types/exams";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateExam = (examId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExamCreate) => {
      const response = await apiReq("PUT", `/exams/${examId}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("تم تعديل الامتحان بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
