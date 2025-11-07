import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";

// Update the hook signature to accept these parameters
interface UseGetAllBranchesParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetAllBranches = (params?: UseGetAllBranchesParams) => {
  const {
    data: response,
    isPending,
    error,
    refetch,
  } = useQuery({
    queryKey: ["branches", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      // Add params to URL if they exist
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.page_size)
        searchParams.append("page_size", params.page_size.toString());
      if (params?.search) searchParams.append("search", params.search);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order)
        searchParams.append("sort_order", params.sort_order);

      const queryString = searchParams.toString();
      const url = queryString ? `/branches?${queryString}` : "/branches";

      return await apiReq("GET", url);
    },
  });

  return {
    branches: response?.branches || [],
    pagination: response?.pagination || {
      page: 1,
      pageSize: params?.page_size || 10,
      total: 0,
      totalPages: 0,
    },
    isPending,
    error,
    refetch,
  };
};
