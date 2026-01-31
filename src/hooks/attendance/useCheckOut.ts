import apiReq from "@/services/apiReq";
import type { CheckOutRequest } from "@/types/attendance";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCheckOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CheckOutRequest) => {
      const response = await apiReq("POST", "/attendance/check-out", data);
      return response;
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "daily"] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "logs"] });

      if (!response.success) {
        toast.warning(response.message || "لقد قمت بتسجيل الخروج بالفعل اليوم");
      } else {
        toast.success(response.message || "تم تسجيل الخروج بنجاح");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");
    },
  });
};
