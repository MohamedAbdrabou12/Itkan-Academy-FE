import { BookOpen, Mail } from "lucide-react";
import { Link, useSearchParams } from "react-router";

export default function PasswordResetSentPage() {
  const [params] = useSearchParams();
  const email = params.get("email");

  return (
    <div className="relative min-h-screen bg-linear-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4 overflow-hidden">

      {/*Decorative Hexagons */}
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

          <Mail className="w-14 h-14 text-emerald-600 mx-auto mb-4" />

          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            تم إرسال رابط إعادة التعيين
          </h2>

          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            لقد تم إرسال رابط تعيين كلمة المرور إلى البريد:
            <br />
            <span className="font-semibold text-emerald-700">{email}</span>
            <br />
            يرجى فحص بريدك الإلكتروني.
          </p>

          <div className="space-y-4">
            <a
              href="https://mail.google.com"
              target="_blank"
              className="block w-full rounded-xl bg-emerald-600 py-4 text-lg font-semibold text-white text-center hover:bg-emerald-700 transition"
            >
              الذهاب إلى Gmail
            </a>

            <Link
              to="/login"
              className="block w-full rounded-xl bg-gray-200 py-4 text-lg font-semibold text-gray-800 text-center hover:bg-gray-300"
            >
              العودة لتسجيل الدخول
            </Link>
          </div>

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
