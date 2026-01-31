import apiReq from "@/services/apiReq";
import type { KPITemplate } from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

export const useGetKPITemplates = (
  isGlobal?: boolean,
  createdByUserId?: number,
) => {
  return useQuery<KPITemplate[]>({
    queryKey: ["staff-evaluations", "templates", isGlobal, createdByUserId],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (isGlobal !== undefined) {
        searchParams.append("is_global", isGlobal.toString());
      }
      if (createdByUserId) {
        searchParams.append("created_by_user_id", createdByUserId.toString());
      }
      const queryString = searchParams.toString();
      const url = queryString
        ? `/staff-evaluations/kpi-templates?${queryString}`
        : "/staff-evaluations/kpi-templates";
      return await apiReq("GET", url);
    },
  });
};
