import apiReq from "@/services/apiReq";
import type { QuestionBankFormData } from "@/validation/questionBankSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuestionBankFormData) => {
      const response = await apiReq("POST", "/question-bank/", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question_bank"] });
      toast.success("تم إضافة السؤال بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
