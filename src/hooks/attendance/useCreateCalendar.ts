import apiReq from "@/services/apiReq";
import type { SchoolCalendarCreate } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SchoolCalendarCreate) => {
      const response = await apiReq("POST", "/attendance/calendars", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "calendars"] });
      toast.success("تم إنشاء التقويم بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء التقويم");
    },
  });
};
