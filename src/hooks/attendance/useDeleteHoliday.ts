import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteHoliday = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      calendar_id,
      holiday_id,
    }: {
      calendar_id: number;
      holiday_id: number;
    }) => {
      const response = await apiReq(
        "DELETE",
        `/attendance/calendars/${calendar_id}/holidays/${holiday_id}`,
      );
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "calendars"] });
      toast.success("تم حذف العطلة بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء حذف العطلة");
    },
  });
};
