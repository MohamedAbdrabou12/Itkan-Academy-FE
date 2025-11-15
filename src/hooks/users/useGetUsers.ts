import apiReq from "@/services/apiReq";
import type { UsersResponse } from "@/types/users";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";

interface UseGetAllUsersParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetAllUsers = (params?: UseGetAllUsersParams) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } = useQuery<UsersResponse>({
    queryKey: ["users", { ...params, search: debouncedSearch }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      // Add params to URL if they exist
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.size) searchParams.append("size", params.size.toString());
      if (debouncedSearch) searchParams.append("search", debouncedSearch);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString ? `/users?${queryString}` : "/users";

      return await apiReq("GET", url);
    },
  });

  return {
    users: data?.items || [],
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
