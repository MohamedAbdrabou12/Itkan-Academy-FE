import apiReq from "@/services/apiReq";
import type { Permission } from "@/types/permissions";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAvailablePermissions = () => {
  const {
    data: permissions,
    isLoading,
    error,
  } = useQuery<Permission[]>({
    queryKey: ["available-permissions"],
    queryFn: async () => {
      return await apiReq("GET", "/permissions");
    },
    staleTime: 1000 * 60 * 60 * 24, // 1 day
  });

  return { permissions, isLoading, error };
};
