import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type { LoginResponse } from "@/types/auth";
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
  const { login: loginUser } = useAuthStore();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: LoginFormData) => {
      return await apiReq("POST", "/auth/login", values);
    },
    onSuccess: (res: LoginResponse) => {
      loginUser(res);
      queryClient.setQueryData(["me"], res.user);
      navigate(getHomePath(res.user.role_name), { replace: true });
    },
    onError: (err) => {
      console.log("Error in Login: ", err);
      toast(err.message, { type: "error" });
    },
  });

  return { login, isPending };
}
