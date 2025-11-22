import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStudent } from "@/services/students";
import type { StudentFormData } from "@/validation/studentSchema";

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: StudentFormData & { id: number }) => {
      const payload = {
        ...data,
        phone: data.phone === "" ? null : data.phone,
        admission_date: data.admission_date || null,
        branch_ids: data.branch_ids?.map(Number) ?? [],
        class_ids: data.class_ids?.map(Number) ?? [],
        status: data.status,
      };
      return updateStudent(id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
