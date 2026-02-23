import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type {
  EmployeeEvaluationWithDetails,
  EvaluationStatus,
} from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

interface UseGetEvaluationsParams {
  cycle_id?: number;
  employee_user_id?: number;
  status?: EvaluationStatus;
}

export const useGetEvaluations = (params?: UseGetEvaluationsParams) => {
  const activeBranch = useAuthStore((state) => state.activeBranch);

  return useQuery<EmployeeEvaluationWithDetails[]>({
    queryKey: ["staff-evaluations", "evaluations", params, activeBranch],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.cycle_id) {
        searchParams.append("cycle_id", params.cycle_id.toString());
      }
      if (params?.employee_user_id) {
        searchParams.append(
          "employee_user_id",
          params.employee_user_id.toString(),
        );
      }
      if (params?.status) {
        searchParams.append("status", params.status);
      }
      const queryString = searchParams.toString();
      const url = queryString
        ? `/staff-evaluations/evaluations?${queryString}`
        : "/staff-evaluations/evaluations";
      return await apiReq("GET", url);
    },
  });
};
