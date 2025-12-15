import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (questionId: string) => {
      const response = await apiReq("DELETE", `/question-bank/${questionId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["question_bank"] });
      toast.success("تم حذف السؤال بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
