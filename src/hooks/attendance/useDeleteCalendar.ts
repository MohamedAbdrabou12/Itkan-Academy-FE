import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await apiReq("DELETE", `/attendance/calendars/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance", "calendars-list"],
      });
      toast.success("تم حذف التقويم بنجاح");
    },
    onError: (error: Error) => {
      const message = error.message || "فشل في حذف التقويم";
      toast.error(message);
    },
  });
};
