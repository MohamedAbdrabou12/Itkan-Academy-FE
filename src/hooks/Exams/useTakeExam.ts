import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";
import { useGetMe } from "../auth/useGetMe";

export interface TakeExamResponse {
  title: string;
  duration_minutes: number;
  user_start_time: string;
  id: number;
  total_marks: number;
  attempt_id: number;
  status: string;
  questions: TakeExamQuestion[];
}

export interface TakeExamQuestion {
  id: number;
  marks: number;
  order: number;
  title: string;
  difficulty: string;
  options?: Option[];
  type: string;
  question_id: number;
}

export interface Option {
  key: string;
  option: string;
}

export const useTakeExam = (examId: string) => {
  const { me } = useGetMe();
  const {
    data: exam,
    isPending,
    error,
    refetch,
  } = useQuery<TakeExamResponse>({
    queryKey: ["examTake", examId, me?.id],
    queryFn: async () => {
      return await apiReq("GET", `/exams/take/${examId}`);
    },
    enabled: !!me?.id,
    retry: false,
  });

  return {
    data: exam,
    isPending,
    error,
    refetch,
  };
};
