import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStudent } from "@/services/students";
import type { StudentDetails } from "@/types/Students";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteStudent(id);
      return res as StudentDetails & { user: { status: string } };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
