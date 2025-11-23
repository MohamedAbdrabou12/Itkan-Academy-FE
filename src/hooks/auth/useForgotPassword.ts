import { useState } from "react";
import apiReq from "@/services/apiReq";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function forgotPassword(email: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await apiReq("POST", "/auth/forgot-password", { email });
      setLoading(false);
      return data;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const msg = typeof err === "string" ? err : "حدث خطأ أثناء طلب إعادة تعيين كلمة المرور";
        setError(msg);
        throw new Error(msg);
      }
    }
  }

  return { forgotPassword, loading, error };
}
