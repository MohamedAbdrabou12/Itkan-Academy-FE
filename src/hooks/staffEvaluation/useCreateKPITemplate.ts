import apiReq from "@/services/apiReq";
import type { KPITemplate, KPITemplateCreate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateKPITemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: KPITemplateCreate) => {
      return await apiReq<KPITemplate>(
        "POST",
        "/staff-evaluations/kpi-templates",
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "templates"],
      });
      toast.success("تم إنشاء القالب بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "حدث خطأ أثناء إنشاء القالب");
    },
  });
};
