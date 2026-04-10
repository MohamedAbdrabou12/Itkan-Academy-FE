import apiReq from "@/services/apiReq";
import type { PayrollRecordFormData } from "@/validation/payrollRecordSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useEditPayrollRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: PayrollRecordFormData & { id: number }) => {
      return await apiReq(
        "PUT",
        `/payroll/cycles/edit-record/${id}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payroll-records"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useEditPayrollRecord;
