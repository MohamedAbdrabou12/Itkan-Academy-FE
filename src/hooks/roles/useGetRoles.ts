import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";

interface RoleQueryParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetRoles = (params: RoleQueryParams = {}) => {
  const defaultParams = {
    page: 1,
    page_size: 10,
    sort_by: "name",
    sort_order: "asc" as const,
    ...params,
  };

  const {
    data: rolesData,
    isPending,
    error,
  } = useQuery({
    queryKey: ["roles", defaultParams],
    queryFn: async () => {
      const queryParams = new URLSearchParams();

      // Always include pagination and sorting with defaults
      queryParams.append("page", defaultParams.page.toString());
      queryParams.append("page_size", defaultParams.page_size.toString());
      queryParams.append("sort_by", defaultParams.sort_by);
      queryParams.append("sort_order", defaultParams.sort_order);

      // Add search if provided
      if (defaultParams.search) {
        queryParams.append("search", defaultParams.search);
      }

      const url = `/roles?${queryParams.toString()}`;
      const response = await apiReq("GET", url);
      return response;
    },
  });

  return {
    roles: rolesData?.data || [],
    pagination: {
      total: rolesData?.total || 0,
      page: rolesData?.page || defaultParams.page,
      pageSize: rolesData?.page_size || defaultParams.page_size,
      totalPages: rolesData?.total_pages || 1,
    },
    isPending,
    error,
  };
};
