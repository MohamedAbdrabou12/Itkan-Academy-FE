import apiReq from "@/services/apiReq";
import type { EvaluationCycle } from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

export const useGetEvaluationCycles = (isActive?: boolean) => {
  return useQuery<EvaluationCycle[]>({
    queryKey: ["staff-evaluations", "cycles", isActive],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (isActive !== undefined) {
        searchParams.append("is_active", isActive.toString());
      }
      const queryString = searchParams.toString();
      const url = queryString
        ? `/staff-evaluations/cycles?${queryString}`
        : "/staff-evaluations/cycles";
      return await apiReq("GET", url);
    },
  });
};
