import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";

export type AvailableExamResponse = AvailableExam[];

export interface AvailableExam {
  id: number;
  end_time: string;
  start_time: string;
  status: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  class_id: number;
  created_by: number;
  creator_name: string;
  class_name: string;
  user_start_time?: string;
  num_of_questions: number;
  attempted: boolean;
}

export const useGetAvailableExams = () => {
  const { data, isPending, error, refetch } = useQuery<AvailableExamResponse>({
    queryKey: ["exams/available-exams"],
    queryFn: async () => {
      return await apiReq("GET", "/exams/available-exams");
    },
  });

  return {
    data: data || [],
    isPending,
    error,
    refetch,
  };
};
