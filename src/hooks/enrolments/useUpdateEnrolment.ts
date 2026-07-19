import apiReq from "@/services/apiReq";
import type { EnrolmentFormData } from "@/validation/enrolmentSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEnrolment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: EnrolmentFormData & { id: number }) => {
      return await apiReq("PUT", `/enrolments/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolments"] });
    },
  });
};
