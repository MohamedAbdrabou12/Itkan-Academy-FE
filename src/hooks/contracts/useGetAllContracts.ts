import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";
import type { ContractsResponse } from "@/types/Contract";
import { useDebounce } from "../useDebounce";

interface UseGetAllContractsParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetAllContracts = (params?: UseGetAllContractsParams) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } = useQuery<ContractsResponse>({
    queryKey: ["contracts", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.size) searchParams.append("size", params.size.toString());
      if (debouncedSearch) searchParams.append("search", debouncedSearch);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString ? `/contracts?${queryString}` : "/contracts";

      return await apiReq("GET", url);
    },
  });

  return {
    contracts: data?.items || [],
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
