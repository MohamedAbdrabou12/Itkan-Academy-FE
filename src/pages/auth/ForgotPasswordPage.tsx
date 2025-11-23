import { useState } from "react";
import { Mail, BookOpen } from "lucide-react";
import { useForgotPassword } from "@/hooks/auth/useForgotPassword";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const { forgotPassword, loading, error } = useForgotPassword(); // Hook works without JWT

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    try {
      await forgotPassword(email); 
      setMessage("تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني.");
    } catch {
      // error is already handled inside the hook
    }
  }

  return (
    <div className="bg-linear-to-br from-emerald-50 to-teal-50 min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-3xl bg-white p-12 shadow-2xl text-center">

          {/* Header */}
          <div className="mb-10 flex items-center justify-center space-x-3 space-x-reverse">
            <BookOpen className="h-12 w-12 text-emerald-600" />
            <span className="text-4xl font-extrabold text-gray-900">مدرسة الإتقان</span>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">نسيت كلمة المرور؟</h2>
          <p className="text-gray-600 mb-6">أدخل بريدك الإلكتروني لتلقي رابط إعادة تعيين كلمة المرور.</p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-4">
            {/* Email input */}
            <div className="text-right relative">
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                البريد الإلكتروني
              </label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-right focus:border-emerald-600 focus:ring-emerald-600"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Messages */}
            {message && <p className="text-green-600 font-medium text-right">{message}</p>}
            {error && <p className="text-red-600 font-medium text-right">{error}</p>}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}