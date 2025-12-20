import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type { LoginResponse } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { usePermissionsGate } from "./usePermissionGate";

interface LoginFormData {
  identifier: string;
  password: string;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: loginUser } = useAuthStore();
  const { getDashboardRoute } = usePermissionsGate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (values: LoginFormData) => {
      return await apiReq("POST", "/auth/login", {
        identifier: values.identifier,
        password: values.password,
      });
    },
    onSuccess: (res: LoginResponse) => {
      loginUser(res);
      queryClient.setQueryData(["me"], res.user);
      if (res.user.role_name === "Student") {
        navigate("/", { replace: true });
      } else {
        navigate(getDashboardRoute(res.user.permissions.map((p) => p.code)), {
          replace: true,
        });
      }
    },
    // onSuccess: (res: LoginResponse) => {
    //   loginUser(res);
    //   queryClient.setQueryData(["me"], res.user);
    //   navigate(getDashboardRoute([PermissionKeys.SYSTEM_ROLES_ALL]), {
    //     replace: true,
    //   });
    // },
    onError: (err: Error & { message?: string }) => {
      console.error("Error in Login: ", err);
      toast(err.message || "Login failed", { type: "error" });
    },
  });

  return { login, isPending };
}
