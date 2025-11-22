import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ClassRead } from "@/types/classes";

export const useGetClassesByBranch = (branch_id?: number) => {
  const { data, isFetching, error, refetch } = useQuery<ClassRead[]>({
    queryKey: ["classes", branch_id],
    queryFn: async () => {
      if (!branch_id) return [];
      return await apiReq("GET", `/classes/by-branch/${branch_id}`);
    },
    enabled: !!branch_id,
  });

  return {
    classes: data || [],
    isFetching,
    error,
    refetch,
  };
};
