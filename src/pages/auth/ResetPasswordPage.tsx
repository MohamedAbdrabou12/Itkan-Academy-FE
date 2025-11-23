// src/pages/auth/ResetPasswordPage.tsx
// src/pages/auth/ResetPasswordPage.tsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, BookOpen, Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useValidateResetToken } from "@/hooks/auth/useValidateResetToken";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();
  const { validateToken } = useValidateResetToken();

  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    async function checkToken() {
      if (!token) return;
      const isValid = await validateToken(token); // No JWT needed
      setValidToken(isValid);
      if (!isValid) setErrorMsg("رابط إعادة التعيين غير صالح أو منتهي الصلاحية");
    }
    checkToken();
  }, [token, validateToken]); 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("كلمتا المرور غير متطابقتين");
      return;
    }

    if (!token || !validToken) return;

    try {
      await resetPassword(token, password); // Calls API without JWT
      navigate("/login");
    } catch {
      setErrorMsg(resetError || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    }
  }

  return (
    <div className="bg-linear-to-br from-emerald-50 to-teal-50 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl">
        <div className="rounded-3xl bg-white p-12 shadow-2xl text-center">

          {/* Header */}
          <div className="mb-10 flex items-center justify-center space-x-3 space-x-reverse">
            <BookOpen className="h-12 w-12 text-emerald-600" />
            <span className="text-4xl font-extrabold text-gray-900">مدرسة الإتقان</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">إعادة تعيين كلمة المرور</h2>

          {/* Invalid token message */}
          {!token && (
            <p className="text-red-600 font-medium mb-6">
              رابط غير صالح — يرجى التأكد من رابط إعادة التعيين.
            </p>
          )}

          {/* Reset form */}
          {validToken && (
            <form onSubmit={handleSubmit} className="space-y-6 mt-8">

              {/* New password */}
              <div className="text-right relative">
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  كلمة المرور الجديدة
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-right focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute left-4 top-[52px] text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Confirm password */}
              <div className="text-right relative">
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  تأكيد كلمة المرور
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-right focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute left-4 top-[52px] text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Error message */}
              {errorMsg && (
                <p className="text-red-600 font-medium text-right">{errorMsg}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={resetLoading || !validToken}
                className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {resetLoading ? "جارٍ التحديث..." : "تغيير كلمة المرور"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}