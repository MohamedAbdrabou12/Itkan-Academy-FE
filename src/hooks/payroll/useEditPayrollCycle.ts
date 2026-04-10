import apiReq from "@/services/apiReq";
import type { PayrollCycleEditFormData } from "@/validation/payrollCycleSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useEditPayrollCycle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: PayrollCycleEditFormData & { id: number }) => {
      const searchParams = new URLSearchParams();
      searchParams.append("status", status);

      return await apiReq("PUT", `/payroll/cycles/${id}?${searchParams}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-cycles"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useEditPayrollCycle;
