import apiReq from "@/services/apiReq";
import type { StartEvaluationRequest } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useStartEvaluation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StartEvaluationRequest) => {
      return await apiReq("POST", "/staff-evaluations/evaluations/start", data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "evaluations"],
      });
      toast.success("تم بدء التقييم بنجاح");
      return data;
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء بدء التقييم");
    },
  });
};
