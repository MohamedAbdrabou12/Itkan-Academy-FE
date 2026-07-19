import apiReq from "@/services/apiReq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useDeleteEnrolment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiReq("DELETE", `/enrolments/${id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrolments"] });
      toast.success("تم حذف سجل الالتحاق بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
