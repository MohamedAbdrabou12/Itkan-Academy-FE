import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiReq from "@/services/apiReq";
import type { StudentFormData } from "@/validation/studentSchema";

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StudentFormData) => {
      const payload = {
        ...data,
        phone: data.phone?.trim() || "",
        admission_date: data.admission_date || new Date().toISOString().split("T")[0],
        branch_ids: data.branch_ids?.map(Number) || [],
        class_ids: data.class_ids?.map(Number) || [],
        status: "pending",
      };
      const response = await apiReq("POST", "/students/", payload);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};