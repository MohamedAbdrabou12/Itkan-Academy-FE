import apiReq from "@/services/apiReq";
import type { User } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  const {
    data: me,
    isPending,
    error,
  } = useQuery<User>({
    queryKey: ["me"],
    queryFn: async () => {
      return await apiReq("GET", "/auth/me");
    },
    staleTime: 1000 * 60 * 5, // 5 minuts
  });

  return { me, isPending, error };
};
