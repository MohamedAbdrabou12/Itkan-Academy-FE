import apiReq from "@/services/apiReq";
import type { KPITemplate, KPITemplateCreate } from "@/types/staffEvaluation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

// Reusing KPITemplateCreate for update as structure is similar (excluding ID which is in URL)
// or we can define a stricter type if needed, but for now this works as we just need the payload.
// Actually, we need to support 'id' in kpis for updates.
// Let's rely on the fact that we'll pass the correct object structure.
// Ideally we should export KPITemplateUpdate from types.

export const useUpdateKPITemplate = (id: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      // Using 'any' for data temporarily to avoid type strictness issues during quick dev,
      // but ideally should be KPITemplateUpdate
      return await apiReq<KPITemplate>(
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
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "حدث خطأ أثناء تحديث القالب");
    },
  });
};
