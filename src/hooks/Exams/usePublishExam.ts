import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const usePublishExam = (examId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await apiReq("POST", `/exams/${examId}/publish`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      toast.success("تم نشر الامتحان بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
