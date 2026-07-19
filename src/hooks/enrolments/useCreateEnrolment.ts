import apiReq from "@/services/apiReq";
import type { EnrolmentFormData } from "@/validation/enrolmentSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEnrolment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EnrolmentFormData) => {
      return await apiReq("POST", "/enrolments/", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolments"] });
    },
  });
};
