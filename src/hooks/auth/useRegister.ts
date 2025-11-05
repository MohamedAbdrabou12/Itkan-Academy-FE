import apiReq from "@/services/apiReq";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface RegisterFormData {
  email: string;
  password: string;
}

export function useRegister() {
  const navigate = useNavigate();

  const { mutate: register, isPending } = useMutation({
    mutationFn: async (values: RegisterFormData) => {
      return await apiReq("POST", "/auth/register", values);
    },
    onSuccess: () => {
      navigate("/login", { replace: true });
    },
    onError: (err) => {
      console.log("Error in Register: ", err);
      toast(err.message, { type: "error" });
    },
  });

  return { register, isPending };
}
