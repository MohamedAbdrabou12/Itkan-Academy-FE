import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { DetailedSubject } from "@/types/educationalContent";

export const useGetSubject = (id?: string | null) => {
  const { data, isPending, error, refetch } = useQuery<DetailedSubject>({
    queryKey: ["subjects", id],
    enabled: !!id,
    queryFn: async () => {
      return await apiReq("GET", `/subjects/${id}`);
    },
  });

  return {
    subject: data || null,
    isPending,
    error,
    refetch,
  };
};
