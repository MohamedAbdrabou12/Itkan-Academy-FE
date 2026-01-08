import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";

export type AttemptsResponse = Attempt[];

export interface Attempt {
  exam_id: number;
  student: Student;
  id: number;
  status: "started" | "submitted" | "graded";
  start_time: string;
  end_time: string;
  score: number | null;
  answers: Answer[];
}

export interface Student {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export interface Answer {
  id: number;
  marks: number;
  title: string;
  options: Option[];
  selected_option?: string;
  answer_text?: string;
  marks_obtained?: number;
  type: "mcq" | "short_answer" | "essay" | "true_false";
  correct_answer?: string;
}

export interface Option {
  key: string;
  option: string;
}

export const useGetExamAttempts = (examId: string) => {
  const { data, isPending, error, refetch } = useQuery<AttemptsResponse>({
    queryKey: ["exam-attempts", examId],
    queryFn: async () => {
      return await apiReq("GET", `/exam-attempts?exam_id=${examId}`);
    },
  });

  return {
    data: data || [],
    isPending,
    error,
    refetch,
  };
};
