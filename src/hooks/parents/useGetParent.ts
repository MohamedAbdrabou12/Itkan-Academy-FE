import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { ParentDetails } from "@/types/Parents";

export const useGetParent = (parentId?: number | null) => {
  const { data, isPending, error, refetch } = useQuery<ParentDetails>({
    queryKey: ["parent", parentId],
    enabled: !!parentId,
    staleTime: 10000,
    queryFn: async () => {
      return await apiReq("GET", `/parents/${parentId}`);
    },
  });

  return {
    parent: data || null,
    isPending,
    error,
    refetch,
  };
};