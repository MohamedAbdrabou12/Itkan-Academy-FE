import { useState } from "react";
import apiReq from "@/services/apiReq";

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function resetPassword(token: string, newPassword: string) {
    setLoading(true);
    setError(null);
    try {
      const data = await apiReq("POST", "/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setLoading(false);
      return data;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const msg = typeof err === "string" ? err : "حدث خطأ أثناء إعادة تعيين كلمة المرور";
        setError(msg);
        throw new Error(msg);
      }
    }
  }

  return { resetPassword, loading, error };
}