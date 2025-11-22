import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "../useDebounce";
import type { StudentsResponse } from "@/types/Students";
import apiReq from "@/services/apiReq";

interface UseGetAllStudentsParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  status?: string;
}

export const useGetAllStudents = (params?: UseGetAllStudentsParams) => {
  const debouncedSearch = useDebounce(params?.search, 300);

  const { data, isPending, error, refetch } = useQuery<StudentsResponse>({
    queryKey: ["students", { ...params, search: debouncedSearch }],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.append("page", params.page.toString());
      if (params?.size) searchParams.append("size", params.size.toString());
      if (debouncedSearch) searchParams.append("search", debouncedSearch);
      if (params?.sort_by) searchParams.append("sort_by", params.sort_by);
      if (params?.sort_order) searchParams.append("sort_order", params.sort_order);
      if (params?.status) searchParams.append("status", params.status);

      const queryString = searchParams.toString();
      const url = queryString ? `/students?${queryString}` : "/students";
      return await apiReq("GET", url);
    },
  });

  return {
    students: data?.items || [],
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
