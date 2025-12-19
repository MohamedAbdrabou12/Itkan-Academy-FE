import { useQuery } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";

export const useGetStudentsByClasses = (class_ids?: string[]) => {
  const { data, isFetching, error, refetch } = useQuery<
    { id: number; name: string }[]
  >({
    queryKey: ["students_by_classes", class_ids],
    queryFn: async () => {
      if (!class_ids?.length) return [];
      return await apiReq("POST", `/students/by-classes`, {
        class_ids,
      });
    },
    enabled: !!class_ids?.length,
  });

  return {
    students: data || [],
    isFetching,
    error,
    refetch,
  };
};