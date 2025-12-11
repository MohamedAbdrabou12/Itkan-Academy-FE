import { useState } from "react";
import { Mail, BookOpen } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";
import { useNavigate } from "react-router";

export default function ForgotPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { forgotPassword, loading } = useForgotPassword();
  const navigate = useNavigate();

  // national ID validation
  function isValidNationalId(value: string) {
    return /^\d{14}$/.test(value);
  }
  // email validation
  function isValidEmail(value: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidNationalId(identifier) && !isValidEmail(identifier)) {
      setError("يرجى إدخال بريد إلكتروني صالح أو رقم قومي مكون من 14 رقمًا");
      return;
    }

    try {
      const result = await forgotPassword(identifier);

      if (isValidNationalId(identifier) && result?.direct_reset && result?.user_id) {
        navigate(`/reset-password?user_id=${result.user_id}`);
        return;
      }

      if (isValidEmail(identifier)) {

        navigate(`/password-reset-sent?email=${encodeURIComponent(identifier)}`);
        return;
      }

    } catch (err) {
      console.error("Forgot password error:", err);
      setError("حدث خطأ أثناء إرسال طلب إعادة التعيين");
    }
  }

  return (
    <div className="relative min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 overflow-hidden">
      {/* Decorative hexagons */}
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
            نسيت كلمة المرور؟
          </h2>
          <p className="text-gray-600 text-center mb-8">
            أدخل البريد الإلكتروني أو الرقم القومي لاستعادة كلمة المرور.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8">

            <div className="relative text-right">
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 w-5 h-5" />

              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="peer w-full rounded-xl border border-gray-300 px-4 py-4 pr-12 text-right focus:border-emerald-600 focus:ring-emerald-600 outline-none transition"
                required
              />

              <label
                className="absolute right-12 top-1/2 -translate-y-1/2 bg-white px-2 text-gray-600 transition-all
                peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm peer-focus:text-emerald-600
                peer-not-placeholder-shown:top-0 peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:text-sm"
              >
                البريد الإلكتروني أو الرقم القومي
              </label>
            </div>

            {error && <p className="text-red-600 font-medium text-right">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال"}
            </button>
          </form>
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