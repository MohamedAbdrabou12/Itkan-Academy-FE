import apiReq from "@/services/apiReq";
import type { EvaluationCycleUpdate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateEvaluationCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: EvaluationCycleUpdate;
    }) => {
      return await apiReq("PUT", `/staff-evaluations/cycles/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "cycles"],
      });
      toast.success("تم تحديث دورة التقييم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث الدورة");
    },
  });
};
