import apiReq from "@/services/apiReq";
import type { AddClassRequest } from "@/types/classes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddClassRequest) => {
      const response = await apiReq("POST", "/classes", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("تم إضافة الفصل بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
