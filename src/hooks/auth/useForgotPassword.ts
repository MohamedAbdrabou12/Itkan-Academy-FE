import { useState } from "react";
import apiReq from "@/services/apiReq";

export function useForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function forgotPassword(identifier: string) {
    setLoading(true);
    setError(null);

    try {
      const data = await apiReq("POST", "/auth/forgot-password", {
        identifier,
      });
      setLoading(false);
      return data;
    } catch (err: unknown) {
      setLoading(false);
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        const msg =
          typeof err === "string"
            ? err
            : "An error occurred while sending the reset request";
        setError(msg);
        throw new Error(msg);
      }
    }
  }

  return { forgotPassword, loading, error };
}