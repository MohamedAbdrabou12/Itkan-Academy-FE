import apiReq from "@/services/apiReq";
import type { QuestionBankFormData } from "@/validation/questionBankSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePutQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: QuestionBankFormData & { id: number }) => {
      const response = await apiReq("PUT", `/question-bank/${data.id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question_bank"] });
      toast.success("تم تعديل السؤال بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
