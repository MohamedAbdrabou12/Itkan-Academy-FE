import apiReq from "@/services/apiReq";
import type { ContractFormData } from "@/validation/contractSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const useCreateContract = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContractFormData) => {
      return await apiReq("POST", "/contracts/register", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
