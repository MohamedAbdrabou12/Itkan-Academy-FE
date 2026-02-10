import apiReq from "@/services/apiReq";
import type { KPI } from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

export const useGetTemplateKPIs = (templateId: number) => {
  return useQuery<KPI[]>({
    queryKey: ["staff-evaluations", "templates", templateId, "kpis"],
    queryFn: async () => {
      return await apiReq(
        "GET",
        `/staff-evaluations/kpi-templates/${templateId}/kpis`,
      );
    },
    enabled: !!templateId,
  });
};
