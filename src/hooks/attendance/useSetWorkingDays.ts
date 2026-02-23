import apiReq from "@/services/apiReq";
import type { CalendarWorkingDayCreate } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useSetWorkingDays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      calendar_id,
      working_days,
    }: {
      calendar_id: number;
      working_days: CalendarWorkingDayCreate[];
    }) => {
      const response = await apiReq(
        "POST",
        `/attendance/calendars/${calendar_id}/working-days`,
        working_days,
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "calendars"] });
      queryClient.invalidateQueries({
        queryKey: ["attendance", "working-days", variables.calendar_id],
      });
      toast.success("تم تحديث أيام العمل بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تحديث أيام العمل");
    },
  });
};
