import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type {
  StudentProgressByStudentList,
  StudentProgressBySubjectList,
} from "@/types/studentProgress";
import { useQuery } from "@tanstack/react-query";

export const useGetStudentProgressAsStudent = () => {
  const userId = useAuthStore((store) => store.user?.id);

  const { data, isPending, error, refetch } =
    useQuery<StudentProgressBySubjectList>({
      queryKey: ["student-progress", userId],
      queryFn: async () => {
        const pathname = `/student-progress/as-student`;
        return await apiReq("GET", pathname);
      },
    });

  return {
    progressGroups: data,
    isPending,
    error,
    refetch,
  };
};

export const useGetStudentProgressAsParent = () => {
  const userId = useAuthStore((store) => store.user?.id);

  const { data, isPending, error, refetch } =
    useQuery<StudentProgressByStudentList>({
      queryKey: ["student-progress", userId],
      queryFn: async () => {
        const pathname = `/student-progress/as-parent`;
        return await apiReq("GET", pathname);
      },
    });

  return {
    progressGroups: data,
    isPending,
    error,
    refetch,
  };
};
