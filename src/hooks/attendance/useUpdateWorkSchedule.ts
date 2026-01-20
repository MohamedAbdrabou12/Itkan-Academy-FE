import apiReq from "@/services/apiReq";
import type { StaffWorkSchedule } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UpdateWorkScheduleParams {
  id: number;
  data: Partial<StaffWorkSchedule>;
}

export const useUpdateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateWorkScheduleParams) => {
      return await apiReq("PUT", `/attendance/work-schedules/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", "work-schedules-list"],
      });
      toast.success("تم تحديث جدول العمل بنجاح");
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || "فشل في تحديث جدول العمل";
      toast.error(message);
    },
  });
};
