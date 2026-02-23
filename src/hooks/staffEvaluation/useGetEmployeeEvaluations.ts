import apiReq from "@/services/apiReq";
import type { EmployeeEvaluation } from "@/types/staffEvaluation";
import { useQuery } from "@tanstack/react-query";

export const useGetEmployeeEvaluations = (userId: number) => {
  return useQuery<EmployeeEvaluation[]>({
    queryKey: ["staff-evaluations", "employee", userId],
    queryFn: async () => {
      return await apiReq(
        "GET",
        `/staff-evaluations/evaluations/employee/${userId}`,
      );
    },
    enabled: !!userId,
  });
};
