import apiReq from "@/services/apiReq";
import { useQuery } from "@tanstack/react-query";

export const useGetMe = () => {
  const {
    data: me,
    isPending,
    error,
  } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      return await apiReq("GET", "/auth/me");
    },
  });

  return { me, isPending, error };
};
