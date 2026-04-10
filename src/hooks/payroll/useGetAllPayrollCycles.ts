import apiReq from "@/services/apiReq";
import type { PayrollCyclesResponse } from "@/types/PayrollCycle";
import { useQuery } from "@tanstack/react-query";

interface UseGetAllPayrollCyclessParams {
  page?: number;
  size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetAllPayrollCycles = (
  params?: UseGetAllPayrollCyclessParams,
) => {
  const { data, isPending, error, refetch } = useQuery<PayrollCyclesResponse>({
    queryKey: ["payroll-cycles", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.size) searchParams.append("size", params.size.toString());
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString
        ? `/payroll/cycles?${queryString}`
        : "/payroll/cycles";

      return await apiReq("GET", url);
    },
  });

  return {
    payrollCycles: data?.items || [],
    pagination: {
      page: data?.page || 1,
      pageSize: data?.size || 10,
      total: data?.total || 0,
      totalPages: data?.pages || 0,
    },
    isPending,
    error,
    refetch,
  };
};
