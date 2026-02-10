import type { TemplateFormValues } from "@/pages/staffEvaluation/KPITemplatesPage";
import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateKPITemplate = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TemplateFormValues) => {
      // Using 'any' for data temporarily to avoid type strictness issues during quick dev,
      // but ideally should be KPITemplateUpdate
      return await apiReq(
        "PUT",
        `/staff-evaluations/kpi-templates/${id}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "templates"],
      });
      // Also invalidate specific template query if exists
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "template", id],
      });
      toast.success("تم تحديث القالب بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث القالب");
    },
  });
};
