import apiReq from "@/services/apiReq";
import type { PayrollCycleGenerateFormData } from "@/validation/payrollCycleSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useGeneratePayrollCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PayrollCycleGenerateFormData) => {
      const searchParams = new URLSearchParams();
      searchParams.append("month", data.month);
      searchParams.append("year", data.year);

      return await apiReq(
        "POST",
        `/payroll/cycles/generate?${searchParams}`,
        undefined,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-cycles"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
