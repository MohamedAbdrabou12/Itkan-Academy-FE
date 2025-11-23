import { useState } from "react";
import apiReq from "@/services/apiReq";

export function useValidateResetToken() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function validateToken(token: string) {
    setLoading(true);
    setError(null);
    try {
      // This endpoint no longer requires JWT
      const data = await apiReq("POST", "/auth/validate-reset-token", { token });
      setLoading(false);
      return data.valid;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        const msg = typeof err === "string" ? err : "حدث خطأ أثناء التحقق من الرابط";
        setError(msg);
      }
      return false;
    }
  }

  return { validateToken, loading, error };
}
