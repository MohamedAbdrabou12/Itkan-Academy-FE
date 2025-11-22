import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStudent } from "@/services/students";
import type { StudentFormData } from "@/validation/studentSchema";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: StudentFormData) =>
      createStudent({
        ...data,
        phone: data.phone === "" ? null : data.phone,
        admission_date: data.admission_date || null,
        branch_ids: data.branch_ids?.map(Number) || [],
        class_ids: data.class_ids?.map(Number) || null,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
