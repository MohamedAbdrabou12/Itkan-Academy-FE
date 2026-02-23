import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type { StaffDetails } from "@/types/users";
import { useQuery } from "@tanstack/react-query";

export const useGetBranchStaff = () => {
  const activeBranch = useAuthStore((state) => state.activeBranch);

  const { data, isPending, error, refetch } = useQuery<StaffDetails[]>({
    queryKey: ["branches", "staff", activeBranch?.id],
    queryFn: async () => {
      return await apiReq("GET", `/branches/staff`);
    },
  });

  return {
    staff: data || [],
    isPending,
    error,
    refetch,
  };
};
