import apiReq from "@/services/apiReq";
import type { StaffFormData } from "@/validation/staffSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: StaffFormData) => {
      const response = await apiReq("POST", "/users/staff", data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("تم إضافة المدير بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
