import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface SubmitExamPayload {
  attemptId: string;
  exam_id: string;
  answers: {
    question_id: string;
    selected_option?: string;
    answer_text?: string;
  }[];
}
export const useSubmitExam = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SubmitExamPayload) => {
      const { attemptId, ...payload } = data;
      const response = await apiReq(
        "POST",
        `/exam-answers/bulk?attempt_id=${attemptId}`,
        payload,
      );
      return response;
    },
    onSuccess: () => {
      navigate("/");
      toast.success("تم ارسال الإجابات بنجاح");
      queryClient.invalidateQueries({ queryKey: ["exams/available-exams"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
