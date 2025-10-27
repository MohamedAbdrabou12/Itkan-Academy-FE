import apiReq from "@/services/apiReq";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface RegisterFormData {
  email: string;
  password: string;
}

export function useRegister() {
  const { mutate: register, isPending } = useMutation({
    mutationFn: async (values: RegisterFormData) => {
      return await apiReq("POST", "/auth/register", values);
    },
    onSuccess: () => {},
    onError: (err) => {
      console.log("Error in Register: ", err);
      toast(err.message, { type: "error" });
    },
  });

  return { register, isPending };
}
