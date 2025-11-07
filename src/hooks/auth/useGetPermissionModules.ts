import apiReq from "@/services/apiReq";
import type { PermissionModuleResponse } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetPermissionModules = () => {
  const {
    data: permissionModules,
    isPending,
    error,
  } = useQuery<PermissionModuleResponse>({
    queryKey: ["permissionsModules"],
    queryFn: async () => {
      return await apiReq("GET", "/permisssionModules");
    },
    retry: false,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  return { permissionModules, isPending, error };
};
