import apiReq from "@/services/apiReq";
import type { ContractFormData } from "@/validation/contractSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useEditContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: ContractFormData & { id: number }) => {
      return await apiReq("PUT", `/contracts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export default useEditContract;
