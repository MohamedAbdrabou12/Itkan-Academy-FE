import apiReq from "@/services/apiReq";
import type { KPI, KPICreate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateKPI = (templateId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KPICreate) => {
      return await apiReq<KPI>(
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
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "حدث خطأ أثناء إضافة المؤشر");
    },
  });
};
