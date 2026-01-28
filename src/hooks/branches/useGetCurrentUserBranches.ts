import apiReq from "@/services/apiReq";
import type { BranchDetails } from "@/types/Branches";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth";

export const useGetCurrentUserBranches = () => {
  const activeBranch = useAuthStore((state) => state.activeBranch);

  const { data, isPending, error, refetch } = useQuery<BranchDetails[]>({
    queryKey: [
      "branches",
      activeBranch,
    ],
    queryFn: async () => {
      return await apiReq("GET", "/branches/me");
    },
  });

  return {
    branches: data || [],
    isPending,
    error,
    refetch,
  };
};
