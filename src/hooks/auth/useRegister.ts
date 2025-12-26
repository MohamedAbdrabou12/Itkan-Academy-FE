import apiReq from "@/services/apiReq";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { showToast } from "@/utils/toasts";

export interface RegisterFormData {
  full_name: string;
  email?: string;
  phone: string;
  password: string;
  national_id: string;
}

interface BackendValidationError {
  loc: (string | number)[];
  msg: string;
}

interface ErrorResponse {
  detail?: BackendValidationError[] | string;
}

interface AxiosLikeError {
  response?: {
    data?: ErrorResponse;
  };
  message?: string;
}

function isErrorWithResponse(error: unknown): error is AxiosLikeError {
  return typeof error === "object" && error !== null;
}

export function useRegister() {
  const navigate = useNavigate();

  const { mutate: register, isPending } = useMutation({
    mutationFn: (values: RegisterFormData) =>
      apiReq("POST", "/auth/register", values),

    onSuccess: () => {
      showToast("تم إنشاء الحساب بنجاح", "success");
      navigate("/register-pending", { replace: true });
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
          if (field === "national_id") {
            showToast("الرقم القومي يجب أن يكون 14 رقماً", "error");
          } else {
            showToast(e.msg, "error");
          }
        });
        return;
      }

      const errorMessage = typeof detail === "string" ? detail : error.message || "";

      if (errorMessage.includes("NationalID already registered")) {
        showToast("الرقم القومي مسجل بالفعل", "error");
        return;
      }

      if (errorMessage.includes("Email already registered")) {
        showToast("البريد الإلكتروني مستخدم بالفعل", "error");
        return;
      }

      if (errorMessage) {
        showToast(errorMessage.replace("Error: ", ""), "error");
        return;
      }

      showToast("حدث خطأ في الاتصال بالخادم", "error");
    },
  });

  return { register, isPending };
}