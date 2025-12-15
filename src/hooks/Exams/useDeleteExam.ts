import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (examId: string) => {
      const response = await apiReq("DELETE", `/exams/${examId}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("تم حذف الامتحان بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
