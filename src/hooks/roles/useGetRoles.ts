import apiReq from "@/services/apiReq";
import type { RolesResponse } from "@/types/Roles";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";
import { useAuthStore } from "@/stores/auth";

interface RoleQueryParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetRoles = (params: RoleQueryParams = {}) => {
  const debouncedSearch = useDebounce(params?.search, 300);
  const activeBranch = useAuthStore((state) => state.activeBranch);

  const defaultParams = {
    page: 1,
    size: 10,
    sort_by: "name",
    sort_order: "asc" as const,
    ...params,
  };

  const { data, isPending, error, refetch } = useQuery<RolesResponse>({
    queryKey: ["roles", { ...params, search: debouncedSearch }, activeBranch],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      // Always include pagination and sorting with defaults
      queryParams.append("page", defaultParams.page.toString());
      queryParams.append("size", defaultParams.size.toString());
      queryParams.append("sort_by", defaultParams.sort_by);
      queryParams.append("sort_order", defaultParams.sort_order);
      if (debouncedSearch) queryParams.append("search", debouncedSearch);

      const url = `/roles?${queryParams.toString()}`;
      const response = await apiReq("GET", url);
      return response;
    },
  });

  return {
    roles: data?.items || [],
    pagination: {
      total: data?.total || 0,
      page: data?.page || defaultParams.page,
      pageSize: data?.size || defaultParams.size,
      totalPages: data?.pages || 1,
    },
    isPending,
    error,
    refetch,
  };
};
