import apiReq from "@/services/apiReq";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

export interface ExamAttempt {
  exam_id: number;
  student_id: number;
  id: number;
  status: string;
  start_time: string;
  end_time?: string;
  score?: number;
}

export const useExamStart = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: async (examId: string) => {
      const response = await apiReq("post", `/exam-attempts/start`, {
        exam_id: examId,
      });
      return response;
    },
    onSuccess: (res: ExamAttempt) => {
      navigate(`/exams/${res.exam_id}/take`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
