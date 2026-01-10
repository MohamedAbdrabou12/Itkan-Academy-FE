import apiReq from "@/services/apiReq";
import { type Subject } from "@/types/subjects";
import { useQuery } from "@tanstack/react-query";

export const useGetSubjectsByCurriculum = (curriculum_id?: string) => {
  const {
    data: subjects,
    isPending,
    error,
    refetch,
  } = useQuery<Subject[]>({
    queryKey: ["subjects_by_curriculum", curriculum_id],
    queryFn: async () => {
      return await apiReq("GET", `/subjects/by-curriculum/${curriculum_id}`);
    },
    enabled: !!curriculum_id,
  });

  return {
    subjects: subjects || [],
    isPending,
    error,
    refetch,
  };
};
