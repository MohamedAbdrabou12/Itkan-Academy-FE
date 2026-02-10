import apiReq from "@/services/apiReq";
import type { KPITemplateCreate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateKPITemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KPITemplateCreate) => {
      return await apiReq("POST", "/staff-evaluations/kpi-templates", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "templates"],
      });
      toast.success("تم إنشاء القالب بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء القالب");
    },
  });
};
