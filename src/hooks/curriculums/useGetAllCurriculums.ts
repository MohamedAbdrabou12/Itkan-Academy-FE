import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";

interface UseGetAllCurriculumsParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export const useGetAllCurriculums = (params?: UseGetAllCurriculumsParams) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["curriculums", { ...params, search: debouncedSearch }],
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
      const url = queryString ? `/curriculums?${queryString}` : "/curriculums";

      return await apiReq("GET", url);
    },
  });

  return {
    curriculums: data?.items || [],
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
