import apiReq from "@/services/apiReq";
import type { ClassStudent } from "@/types/classes";
import { useQuery } from "@tanstack/react-query";

export const useGetClassStudents = (classId: number | null) => {
  const {
    data: classStudents,
    isPending,
    error,
  } = useQuery<ClassStudent[]>({
    queryKey: ["class-students", classId],
    queryFn: async () => {
      return await apiReq("GET", `/classes/${classId}/students`);
    },
    enabled: !!classId,
  });

  return { classStudents, isPending, error };
};
