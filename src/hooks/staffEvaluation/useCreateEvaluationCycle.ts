import apiReq from "@/services/apiReq";
import type {
  EvaluationCycle,
  EvaluationCycleCreate,
} from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateEvaluationCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EvaluationCycleCreate) => {
      return await apiReq<EvaluationCycle>(
        "POST",
        "/staff-evaluations/cycles",
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "cycles"],
      });
      toast.success("تم إنشاء دورة التقييم بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "حدث خطأ أثناء إنشاء الدورة");
    },
  });
};
