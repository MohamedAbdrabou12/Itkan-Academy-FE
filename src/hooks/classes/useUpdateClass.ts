import apiReq from "@/services/apiReq";
import type { AddClassRequest } from "@/types/classes";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateClass = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: AddClassRequest & { id: number }) => {
      const response = await apiReq("PUT", `/classes/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classes"] });
      toast.success("تم تعديل الفصل بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
