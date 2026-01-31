import apiReq from "@/services/apiReq";
import type { EmployeeEvaluation } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useApproveEvaluation = (evaluationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await apiReq<EmployeeEvaluation>(
        "POST",
        `/staff-evaluations/evaluations/${evaluationId}/approve`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "evaluations"],
      });
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "evaluations", evaluationId.toString()],
      });
      toast.success("تم اعتماد التقييم بنجاح");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || "حدث خطأ أثناء اعتماد التقييم",
      );
    },
  });
};
