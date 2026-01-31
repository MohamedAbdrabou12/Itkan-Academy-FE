import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";

export const useGetBranchStaff = () => {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: ["branches", "staff"],
    queryFn: async () => {
      return await apiReq("GET", "/branches/staff");
    },
  });

  return {
    staff: data || [],
    isPending,
    error,
    refetch,
  };
};
