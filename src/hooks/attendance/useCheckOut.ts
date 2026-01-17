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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance", "daily"] });
      queryClient.invalidateQueries({ queryKey: ["attendance", "logs"] });
      toast.success("تم تسجيل الخروج بنجاح");
    },
    onError: (error: Error) => {
      toast.error(error.message || "حدث خطأ أثناء تسجيل الخروج");
    },
  });
};
