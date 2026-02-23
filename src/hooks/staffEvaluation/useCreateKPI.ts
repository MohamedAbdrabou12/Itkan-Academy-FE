import apiReq from "@/services/apiReq";
import type { KPICreate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateKPI = (templateId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KPICreate) => {
      return await apiReq(
        "POST",
        `/staff-evaluations/kpi-templates/${templateId}/kpis`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "templates", templateId, "kpis"],
      });
      toast.success("تم إضافة المؤشر بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة المؤشر");
    },
  });
};
