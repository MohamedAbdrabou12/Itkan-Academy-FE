import apiReq from "@/services/apiReq";
import type { StaffWorkScheduleCreate } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateWorkSchedule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StaffWorkScheduleCreate) => {
      const response = await apiReq("POST", "/attendance/work-schedules", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", "work-schedules-list"],
      });
      toast.success("تم إنشاء جدول العمل بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء جدول العمل");
    },
  });
};
