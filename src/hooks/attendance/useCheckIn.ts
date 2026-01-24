import apiReq from "@/services/apiReq";
import type { CheckInRequest } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCheckIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckInRequest) => {
      const response = await apiReq("POST", "/attendance/check-in", data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "daily"] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "logs"] });

      if (!response.success) {
        toast.warning(response.message || "لقد قمت بتسجيل الحضور بالفعل اليوم");
      } else if (response.is_late) {
        toast.warning("تم تسجيل الحضور مع التأخير");
      } else {
        toast.success(response.message || "تم تسجيل الحضور بنجاح");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الحضور");
    },
  });
};
