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
  } = useForm<LoginFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const { login, isPending } = useLogin();

  const onSubmit = async (data: LoginFormData) => {
    login({
      identifier: data.identifier,
      password: data.password,
    });
  };

  const InputClass =
    "w-full rounded-lg border border-gray-300 py-3 px-6 shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 transition-all";

  const PasswordInputClass =
    "w-full rounded-lg border border-gray-300 py-3 px-6 shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 to-teal-50 px-4 py-12 sm:py-20 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200/30 clip-hex animate-bounce-slow"></div>
      <div className="absolute bottom-20 right-16 w-28 h-28 bg-teal-300/30 clip-hex animate-bounce-slower"></div>
      <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-emerald-300/20 clip-hex animate-bounce-slow"></div>
      <div className="absolute bottom-10 left-20 w-24 h-24 bg-teal-200/20 clip-hex animate-bounce-slower"></div>

      <AnimatePresence>
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 lg:p-12 relative z-10"
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="h-10 w-10 text-emerald-600" />
              <span className="text-2xl font-extrabold text-gray-900">مدرسة الإتقان</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h2>
            <p className="text-gray-500 text-sm">مرحباً بك مجدداً</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Mail className="h-5 w-5 text-emerald-600" />
                <label className="text-sm font-medium text-gray-700">البريد الإلكتروني أو الرقم القومي *</label>
              </div>
              <input
                type="text"
                {...register("identifier", {
                  required: "البريد الإلكتروني أو الرقم القومي مطلوب",
                })}
                className={InputClass}
                placeholder="ادخل البريد الإلكتروني أو الرقم القومي"
              />
              <p className="mt-1 text-xs text-red-600 min-h-5">
                {errors.identifier?.message || " "}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="h-5 w-5 text-emerald-600" />
                <label className="text-sm font-medium text-gray-700">كلمة المرور *</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", { required: "كلمة المرور مطلوبة" })}
                  className={PasswordInputClass}
                  placeholder="ادخل كلمة المرور"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 hover:text-emerald-600 transition"
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-1 text-xs text-red-600 min-h-5">
                {errors.password?.message || " "}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register("rememberMe")}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
                />
                <span className="mr-2 text-sm text-gray-600">تذكرني</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting || isPending}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-full rounded-lg bg-emerald-600 py-3 text-base font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-transform cursor-pointer disabled:opacity-50"
            >
              {isSubmitting || isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                سجل الآن
              </Link>
            </p>
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