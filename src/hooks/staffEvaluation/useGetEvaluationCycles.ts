import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type { EvaluationCycle } from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

export const useGetEvaluationCycles = (isActive?: boolean) => {
  const activeBranch = useAuthStore((state) => state.activeBranch);

  const { data, isPending, error, refetch } = useQuery<EvaluationCycle[]>({
    queryKey: ["staff-evaluations", "cycles", isActive, activeBranch],
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

  return { cycles: data || [], isPending, error, refetch };
};
