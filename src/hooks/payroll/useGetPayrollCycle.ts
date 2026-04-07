import apiReq from "@/services/apiReq";
import type { PayrollCycleDetails } from "@/types/PayrollCycle";
import { useQuery } from "@tanstack/react-query";

export const useGetPayrollCycle = (id: string) => {
  const { data, isPending, error, refetch } = useQuery<PayrollCycleDetails>({
    queryKey: ["payroll-cycles", id],
    queryFn: async () => {
      return await apiReq("GET", "/payroll/cycles/" + id);
    },
  });

  return {
    cycle: data,
    isPending,
    error,
    refetch,
  };
};
