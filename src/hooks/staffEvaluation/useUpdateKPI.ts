import apiReq from "@/services/apiReq";
import type { KPIUpdate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateKPI = (templateId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: KPIUpdate }) => {
      return await apiReq(
        "PUT",
        `/staff-evaluations/kpi-templates/${templateId}/kpis/${id}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "templates", templateId, "kpis"],
      });
      toast.success("تم تحديث المؤشر بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث المؤشر");
    },
  });
};
