import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCloseExam = (examId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiReq("POST", `/exams/${examId}/close`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("تم غلق الامتحان بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
