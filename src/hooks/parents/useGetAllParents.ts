import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";
import apiReq from "@/services/apiReq";
import type { ParentsResponse } from "@/types/Parents";

interface UseGetAllParentsParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetAllParents = (params?: UseGetAllParentsParams) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } = useQuery<ParentsResponse>({
    queryKey: [
      "parents",
      {
        ...params,
        search: debouncedSearch,
      },
    ],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params?.page) searchParams.append("page", String(params.page));
      if (params?.size) searchParams.append("size", String(params.size));
      if (debouncedSearch) searchParams.append("search", debouncedSearch);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order) searchParams.append("sort_order", params.sort_order);

      const query = searchParams.toString();
      const url = query ? `/parents/?${query}` : "/parents/";
      return await apiReq("GET", url);
    },
  });

  return {
    parents: data?.items || [],
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