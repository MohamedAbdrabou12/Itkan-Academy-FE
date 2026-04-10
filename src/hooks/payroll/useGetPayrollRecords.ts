import apiReq from "@/services/apiReq";
import type { PayrollRecordsResponse } from "@/types/PayrollRecord";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";

interface UseGetPayrollRecordsParams {
  cycleId: string;
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetPayrollRecords = (params: UseGetPayrollRecordsParams) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } = useQuery<PayrollRecordsResponse>({
    queryKey: ["payroll-records", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append("page", params.page.toString());
      if (params.size) searchParams.append("size", params.size.toString());
      if (debouncedSearch) searchParams.append("search", debouncedSearch);
      if (params.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url =
        `/payroll/cycles/records/${params.cycleId}` +
        (queryString ? "?" + queryString : "");

      return await apiReq("GET", url);
    },
  });

  return {
    payrollRecords: data?.page_info.items || [],
    itemsTotal: data?.items_total,
    pagination: {
      page: data?.page_info.page || 1,
      pageSize: data?.page_info.size || 10,
      total: data?.page_info.total || 0,
      totalPages: data?.page_info.pages || 0,
    },
    isPending,
    error,
    refetch,
  };
};
