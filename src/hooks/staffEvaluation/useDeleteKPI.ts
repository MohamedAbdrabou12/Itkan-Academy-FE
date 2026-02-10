import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteKPI = (templateId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (kpiId: number) => {
      return await apiReq(
        "DELETE",
        `/staff-evaluations/kpi-templates/${templateId}/kpis/${kpiId}`,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["staff-evaluations", "templates", templateId, "kpis"],
      });
      toast.success("تم حذف المؤشر بنجاح");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.detail || "حدث خطأ أثناء حذف المؤشر");
    },
  });
};
