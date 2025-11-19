import apiReq from "@/services/apiReq";
import type { User } from "@/types/auth";
import type { JWTBranch } from "@/types/Branches";
import type { Class } from "@/types/classes";
import { useQuery } from "@tanstack/react-query";

export const useGetTeacherClasses = (
  user: User | null,
  activeBranch: JWTBranch | null,
) => {
  const {
    data: teacherClasses,
    isPending,
    error,
  } = useQuery<Class[]>({
    queryKey: ["teachers-classes", user!.id, activeBranch!.id],
    queryFn: async () => {
      return await apiReq("GET", "/classes/teacher-classes");
    },
  });

  return { teacherClasses, isPending, error };
};
