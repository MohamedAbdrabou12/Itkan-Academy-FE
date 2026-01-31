import apiReq from "@/services/apiReq";
import type { CalendarHolidayCreate } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      calendar_id,
      holiday,
    }: {
      calendar_id: number;
      holiday: CalendarHolidayCreate;
    }) => {
      const response = await apiReq(
        "POST",
        `/attendance/calendars/${calendar_id}/holidays`,
        holiday,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "calendars"] });
      toast.success("تم إضافة العطلة بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إضافة العطلة");
    },
  });
};
