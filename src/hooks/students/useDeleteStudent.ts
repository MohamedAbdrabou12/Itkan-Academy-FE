import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { StudentDetails } from "@/types/Students";

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student_id: number) => {
      const res = await apiReq("DELETE", `/students/${student_id}`);
      return res as StudentDetails & { user: { status: string } };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};