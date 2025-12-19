import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { StudentCreateFormData } from "@/validation/studentSchema";
export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StudentCreateFormData) => {
      const payload = {
        full_name: data.full_name,
        national_id: data.national_id,
        email: data.email || null,
        phone: data.phone?.trim() || null,
        branch_ids: data.branch_ids?.length ? data.branch_ids.map(Number) : undefined,
        class_ids: data.class_ids?.length ? data.class_ids.map(Number) : undefined,
        admission_date: data.admission_date,
        status: data.status,
        password: data.password,
      };

      return apiReq("POST", "/students/", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
