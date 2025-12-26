import { useLogin } from "@/hooks/auth/useLogin";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: {
      rememberMe: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    login({
      identifier: data.identifier.trim(),
      password: data.password,
    });

    if (data.rememberMe) {
      localStorage.setItem("remember_me", "true");
    } else {
      localStorage.removeItem("remember_me");
    }
  };

  const InputClass =
    "w-full rounded-lg border border-gray-300 py-3 px-6 shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 transition-all";

  return (
    <div className="bg-linear-to-br relative flex min-h-screen items-center justify-center overflow-hidden from-emerald-50 to-teal-50 px-4 py-12 sm:py-20">
      <div className="clip-hex animate-bounce-slow absolute left-10 top-10 h-20 w-20 bg-emerald-200/30" />
      <div className="clip-hex animate-bounce-slower absolute bottom-20 right-16 h-28 w-28 bg-teal-300/30" />
      <div className="clip-hex animate-bounce-slow absolute left-1/3 top-1/2 h-16 w-16 bg-emerald-300/20" />
      <div className="clip-hex animate-bounce-slower absolute bottom-10 left-20 h-24 w-24 bg-teal-200/20" />

      <AnimatePresence>
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10 lg:p-12"
        >
          <div className="mb-10 text-center">
            <div className="mb-2 flex items-center justify-center gap-3">
              <BookOpen className="h-10 w-10 text-emerald-600" />
              <span className="text-2xl font-extrabold text-gray-900">
                مدرسة الإتقان
              </span>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              تسجيل الدخول
            </h2>
            <p className="text-sm text-gray-500">مرحباً بك مجدداً</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-5 w-5 text-emerald-600" />
                البريد الإلكتروني أو الرقم القومي
              </label>
              <input
                {...register("identifier", {
                  required: "البريد الإلكتروني أو الرقم القومي مطلوب",
                })}
                className={InputClass}
                placeholder="ادخل البريد الإلكتروني أو الرقم القومي"
              />
              <p className="min-h-5 text-xs text-red-600">
                {errors.identifier?.message || " "}
              </p>
            </div>

            <div>
              <label className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Lock className="h-5 w-5 text-emerald-600" />
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                  })}
                  className={InputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <Eye /> : <EyeOff />}
                </button>
              </div>
              <p className="min-h-5 text-xs text-red-600">
                {errors.password?.message || " "}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-gray-300 text-emerald-600"
                />
                تذكرني
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-600"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || isPending}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-full rounded-lg bg-emerald-600 py-3 font-bold text-white disabled:opacity-50"
            >
              {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            ليس لديك حساب؟{" "}
            <Link to="/register" className="font-semibold text-emerald-600">
              سجل الآن
            </Link>
          </div>
        </motion.section>
      </AnimatePresence>

      <style>
        {`
          .clip-hex {
            clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0% 50%);
          }
          @keyframes bounce-slow {
            0%,100%{transform:translateY(0);}
            50%{transform:translateY(-10px);}
          }
          @keyframes bounce-slower {
            0%,100%{transform:translateY(0);}
            50%{transform:translateY(-6px);}
          }
          .animate-bounce-slow { animation: bounce-slow 4s ease-in-out infinite; }
          .animate-bounce-slower { animation: bounce-slower 5s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
}