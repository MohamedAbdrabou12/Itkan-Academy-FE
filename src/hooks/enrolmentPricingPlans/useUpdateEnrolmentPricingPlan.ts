import apiReq from "@/services/apiReq";
import type { EnrolmentPricingPlanFormData } from "@/validation/enrolmentPricingPlanSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateEnrolmentPricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: EnrolmentPricingPlanFormData & { id: number }) => {
      return await apiReq("PUT", `/enrolments/pricing-plans/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolment-pricing-plans"] });
    },
  });
};
