import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiReq("DELETE", `/attendance/work-schedules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", "work-schedules-list"],
      });
      toast.success("تم حذف جدول العمل بنجاح");
    },
    onError: (error: Error) => {
      const message = error.message || "فشل في حذف جدول العمل";
      toast.error(message);
    },
  });
};
