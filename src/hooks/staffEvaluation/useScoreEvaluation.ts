import apiReq from "@/services/apiReq";
import type {
  EvaluationKPIScore,
  ScoreEvaluationRequest,
} from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useScoreEvaluation = (evaluationId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ScoreEvaluationRequest) => {
      return await apiReq<EvaluationKPIScore[]>(
        "POST",
        `/staff-evaluations/evaluations/${evaluationId}/score`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "evaluations", evaluationId.toString()],
      });
      toast.success("تم حفظ الدرجات بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "حدث خطأ أثناء حفظ الدرجات");
    },
  });
};
