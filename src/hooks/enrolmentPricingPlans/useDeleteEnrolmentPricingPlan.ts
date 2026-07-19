import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteEnrolmentPricingPlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiReq("DELETE", `/enrolments/pricing-plans/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolments-pricing-plans"] });
      toast.success("تم حذف سجل خطة الدفع بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
