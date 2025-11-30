import apiReq from "@/services/apiReq";
import type { User } from "@/types/auth";
import type { JWTBranch } from "@/types/Branches";
import type { Evaluation } from "@/types/classes";
import { useQuery } from "@tanstack/react-query";

export const useGetEvaluations = (
  user: User | null,
  activeBranch: JWTBranch | null,
) => {
  const {
    data: evaluations,
    isPending,
    error,
  } = useQuery<Evaluation[]>({
    queryKey: ["evaluations", user!.id, activeBranch!.id],
    queryFn: async () => {
      return await apiReq("GET", "/evaluations");
    },
  });

  return { evaluations, isPending, error };
};
