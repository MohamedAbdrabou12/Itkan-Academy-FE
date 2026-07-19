import apiReq from "@/services/apiReq";
import type { EnrolmentPricingPlanFormData } from "@/validation/enrolmentPricingPlanSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEnrolmentPricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EnrolmentPricingPlanFormData) => {
      return await apiReq("POST", "/enrolments/pricing-plans/", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolment-pricing-plans"] });
    },
  });
};
