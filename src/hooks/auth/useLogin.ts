import apiReq from "@/services/apiReq";
import { getHomePath } from "@/utils/getHomePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

interface LoginFormData {
  email: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: LoginFormData) => {
      return await apiReq("POST", "/auth/login", values);
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["me"], user);
      navigate(getHomePath(user.role), { replace: true });
    },
    onError: (err) => {
      console.log("Error in Login: ", err);
      toast(err.message, { type: "error" });
    },
  });

  return { login, isPending };
}
