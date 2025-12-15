import apiReq from "@/services/apiReq";
import type { QuestionBankResponse } from "@/types/questionBank";
import { useQuery } from "@tanstack/react-query";

export const useGetQuestions = () => {
  return useQuery<QuestionBankResponse>({
    queryKey: ["question_bank"],
    queryFn: async () => {
      const response = await apiReq("GET", `/question-bank`);
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
