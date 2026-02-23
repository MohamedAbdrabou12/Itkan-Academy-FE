import apiReq from "@/services/apiReq";
import type { SchoolCalendarCreate } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface UpdateCalendarParams {
  id: number;
  data: Partial<SchoolCalendarCreate>;
}

export const useUpdateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateCalendarParams) => {
      return await apiReq("PUT", `/attendance/calendars/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", "calendars-list"],
      });
      toast.success("تم تحديث التقويم بنجاح");
    },
    onError: (error: Error) => {
      const message = error.message || "فشل في تحديث التقويم";
      toast.error(message);
    },
  });
};
