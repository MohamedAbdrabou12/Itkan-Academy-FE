import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type { KPITemplate } from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

export const useGetKPITemplates = (
  isGlobal?: boolean,
  createdByUserId?: number,
) => {
  const activeBranch = useAuthStore((state) => state.activeBranch);

  const { data, isPending, error, refetch } = useQuery<KPITemplate[]>({
    queryKey: [
      "staff-evaluations",
      "templates",
      isGlobal,
      createdByUserId,
      activeBranch,
    ],
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

  return { templates: data || [], isPending, error, refetch };
};
