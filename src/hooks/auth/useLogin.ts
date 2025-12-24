import apiReq from "@/services/apiReq";
import { useAuthStore } from "@/stores/auth";
import type { LoginResponse } from "@/types/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { showToast } from "@/utils/toasts";
import { usePermissionsGate } from "./usePermissionGate";

interface LoginFormData {
  identifier: string;
  password: string;
}

interface BackendValidationError {
  loc: (string | number)[];
  msg: string;
}

interface ErrorResponse {
  detail?: BackendValidationError[] | string;
}

interface ApiError {
  response?: {
    data?: ErrorResponse;
  };
  message?: string;
}

function isErrorWithResponse(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { login: loginUser } = useAuthStore();
  const { getDashboardRoute } = usePermissionsGate();

  const { mutate: login, isPending } = useMutation({
    mutationFn: (values: LoginFormData) =>
      apiReq("POST", "/auth/login", values),

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

    onError: (error: unknown) => {
      if (!isErrorWithResponse(error)) {
        showToast("حدث خطأ غير متوقع", "error");
        return;
      }

      const detail = error.response?.data?.detail;

      if (Array.isArray(detail)) {
        detail.forEach((e) => {
          const field = e.loc?.[e.loc.length - 1];
          if (field === "identifier") {
            showToast("الرقم القومي أو البريد الإلكتروني غير صحيح", "error");
          } else {
            showToast(e.msg, "error");
          }
        });
        return;
      }

      const errorMessage = typeof detail === "string" ? detail : error.message || "";

      if (errorMessage.includes("Invalid identifier or password")) {
        showToast("الرقم القومي أو كلمة المرور غير صحيحة", "error");
        return;
      }

      if (errorMessage.includes("Account is not activated yet")) {
        showToast("الحساب لم يتم تفعيله بعد", "error");
        return;
      }

      if (errorMessage) {
        showToast(errorMessage.replace("Error: ", ""), "error");
        return;
      }

      showToast("حدث خطأ في الاتصال بالخادم", "error");
    },
  });

  return { login, isPending };
}