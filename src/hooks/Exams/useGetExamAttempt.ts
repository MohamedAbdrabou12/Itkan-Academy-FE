import apiReq from "@/services/apiReq";
import type { QuestionTypes } from "@/types/questionBank";
import { useQuery } from "@tanstack/react-query";

export interface AttemptResponse {
  exam_id: number;
  student: Student;
  id: number;
  status: "started" | "submitted" | "graded";
  start_time: string;
  end_time: string;
  score: number | null;
  answers: Answer[];
  exam: Exam;
}

export interface Student {
  id: number;
  full_name: string;
  email: string;
  phone: string;
}

export interface Answer {
  question_id: string;
  selected_option: string;
  answer_text: string;
  marks_obtained: number;
}

export interface Exam {
  title: string;
  duration_minutes: number;
  questions: Question[];
}

export interface Question {
  id: number;
  marks: number;
  title: string;
  options: Option[];
  type: QuestionTypes;
  correct_answer: string;
}

export interface Option {
  key: string;
  option: string;
}

export const useGetExamAttempt = (attemptId: string) => {
  const { data, isPending, error, refetch } = useQuery<AttemptResponse>({
    queryKey: ["exam-attempt", attemptId],
    queryFn: async () => {
      return await apiReq("GET", `/exam-attempts/${attemptId}`);
    },
  });

  return {
    data: data,
    isPending,
    error,
    refetch,
  };
};
