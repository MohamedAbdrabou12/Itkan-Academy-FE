import apiReq from "@/services/apiReq";
import type { RolesResponse } from "@/types/Roles";
import { useQuery } from "@tanstack/react-query";

export const useGetAllRoles = () => {
  const {
    data: allRoles,
    isPending,
    error,
    refetch,
  } = useQuery<RolesResponse>({
    queryKey: ["all-roles"],
    queryFn: async () => {
      return await apiReq("GET", "/roles?size=100");
    },
  });

  return {
    allRoles,
    isPending,
    error,
    refetch,
  };
};
