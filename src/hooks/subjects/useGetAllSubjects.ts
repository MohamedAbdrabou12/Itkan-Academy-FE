import apiReq from "@/services/apiReq";
import type { Subject } from "@/types/educationalContent";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSubjects = () => {
  const { data, isPending, error, refetch } = useQuery<Subject[]>({
    queryKey: ["subjects"],
    queryFn: async () => {
      return await apiReq("GET", "/subjects");
    },
  });

  return {
    subjects: data,
    isPending,
    error,
    refetch,
  };
};
