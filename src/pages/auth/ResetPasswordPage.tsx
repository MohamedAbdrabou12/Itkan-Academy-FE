import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Lock, BookOpen, Eye, EyeOff } from "lucide-react";
import { useResetPassword } from "@/hooks/auth/useResetPassword";
import { useValidateResetToken } from "@/hooks/auth/useValidateResetToken";
import { motion } from "framer-motion";
import apiReq from "@/services/apiReq";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const userId = searchParams.get("user_id") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [userName, setUserName] = useState("");

  const { resetPassword, loading: resetLoading, error: resetError } = useResetPassword();
  const { validateToken } = useValidateResetToken();
  const [validToken, setValidToken] = useState(false);
  const [directReset, setDirectReset] = useState(false);

  //if userId is present, it's a direct reset link
  useEffect(() => {
    async function init() {
      if (userId) {
        setDirectReset(true);
        try {
          const data = await apiReq("GET", `/auth/get-user-name/${userId}`);
          setUserName(data.full_name || "");
          setValidToken(true);
        } catch {
          setErrorMsg("رابط إعادة التعيين غير صالح أو المستخدم غير موجود");
          setValidToken(false);
        }
      } else if (token) {
        const isValid = await validateToken(token);
        setValidToken(isValid);
        if (!isValid) setErrorMsg("رابط إعادة التعيين غير صالح أو منتهي الصلاحية");
      }
    }
    init();
  }, [userId, token, validateToken]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirm) {
      setErrorMsg("كلمتا المرور غير متطابقتين");
      return;
    }

    if (!validToken) return;

    try {
      if (directReset && userId) {
        await apiReq("POST", `/auth/reset-password-direct`, {
          user_id: userId,
          new_password: password,
        });
      } else if (token) {
        await resetPassword(token, password);
      }
      navigate("/login");
    } catch {
      setErrorMsg(resetError || "حدث خطأ أثناء إعادة تعيين كلمة المرور");
    }
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative Hexagons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-24 h-24 bg-emerald-200 opacity-40 clip-hex animate-float-slow"></div>
        <div className="absolute bottom-20 right-16 w-32 h-32 bg-teal-200 opacity-40 clip-hex animate-float"></div>
        <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-emerald-300 opacity-30 clip-hex animate-float-delay"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="rounded-3xl bg-white/80 backdrop-blur-xl p-10 shadow-2xl border border-white/40">

          <div className="mb-10 flex items-center justify-center space-x-3 space-x-reverse">
            <BookOpen className="h-12 w-12 text-emerald-600" />
            <span className="text-4xl font-extrabold text-gray-900">مدرسة الإتقان</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            إعادة تعيين كلمة المرور
          </h2>

          {errorMsg && (
            <p className="text-red-600 font-medium text-center mb-4">{errorMsg}</p>
          )}

          {validToken && (
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">

              {directReset && (
                <p className="text-gray-700 text-right mb-4">
                  مرحباً <span className="font-semibold">{userName}</span>، يمكنك الآن إعادة تعيين كلمة المرور الخاصة بك.
                </p>
              )}

              <div className="text-right relative">
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  كلمة المرور الجديدة
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-right focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="ادخل كلمة المرور الجديدة"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute left-4 top-[52px] text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>

              <div className="text-right relative">
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <Lock className="h-5 w-5 text-emerald-600" />
                  تأكيد كلمة المرور
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-right focus:border-emerald-600 focus:ring-emerald-600"
                  placeholder="ادخل تأكيد كلمة المرور"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute left-4 top-[52px] text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirm((prev) => !prev)}
                >
                  {showConfirm ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>

              <motion.button
                type="submit"
                disabled={resetLoading || !validToken}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white cursor-pointer disabled:opacity-50"
              >
                {resetLoading ? "جارٍ التحديث..." : "تغيير كلمة المرور"}
              </motion.button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .clip-hex {
          clip-path: polygon(
            25% 5%, 
            75% 5%, 
            100% 50%, 
            75% 95%, 
            25% 95%, 
            0% 50%
          );
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-slow { animation: float-slow 9s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 7s ease-in-out infinite; }
      `}</style>
    </div>
  );
}