import apiReq from "@/services/apiReq";
import type { CalendarHolidayUpdate } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      calendar_id,
      holiday_id,
      holiday,
    }: {
      calendar_id: number;
      holiday_id: number;
      holiday: CalendarHolidayUpdate;
    }) => {
      const response = await apiReq(
        "PUT",
        `/attendance/calendars/${calendar_id}/holidays/${holiday_id}`,
        holiday,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "calendars"] });
      toast.success("تم تحديث العطلة بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث العطلة");
    },
  });
};
