import apiReq from "@/services/apiReq";
import type { StaffFormData } from "@/validation/staffSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useUpdateStaff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: StaffFormData & { id: number }) => {
      const response = await apiReq("PUT", `/users/staff/${id}`, data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff"] });
      toast.success("تم تعديل المدير بنجاح");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
