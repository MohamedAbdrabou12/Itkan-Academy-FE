import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export interface ExamGrade {
  question_id: number;
  marks_obtained: number;
}

export const useExamGrade = (attempt_id: string) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (examGrade: ExamGrade[]) => {
      const response = await apiReq(
        "post",
        `/exam-attempts/${attempt_id}/grade`,
        examGrade,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exam-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["exam-attempt"] });

      toast.success("تم تصحيح الامتحان بنجاح");
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
