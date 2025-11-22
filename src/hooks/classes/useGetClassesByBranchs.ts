import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ClassRead } from "@/types/classes";

export const useGetClassesByBranchs = (branch_ids?: string[]) => {
  const { data, isFetching, error, refetch } = useQuery<ClassRead[]>({
    queryKey: ["classes_by_branches", branch_ids],
    queryFn: async () => {
      if (!branch_ids) return [];
      return await apiReq("POST", `/classes/by-branchs`, { branch_ids });
    },
    enabled: !!branch_ids?.length,
  });

  return {
    classes: data || [],
    isFetching,
    error,
    refetch,
  };
};
