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
    <div className="bg-linear-to-br relative flex min-h-screen items-center justify-center overflow-hidden from-emerald-50 to-teal-50 px-4 py-12 sm:py-20">
      <div className="clip-hex animate-bounce-slow absolute left-10 top-10 h-20 w-20 bg-emerald-200/30"></div>
      <div className="clip-hex animate-bounce-slower absolute bottom-20 right-16 h-28 w-28 bg-teal-300/30"></div>
      <div className="clip-hex animate-bounce-slow absolute left-1/3 top-1/2 h-16 w-16 bg-emerald-300/20"></div>
      <div className="clip-hex animate-bounce-slower absolute bottom-10 left-20 h-24 w-24 bg-teal-200/20"></div>

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
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-2">
                <Mail className="h-5 w-5 text-emerald-600" />
                <label className="text-sm font-medium text-gray-700">
                  البريد الإلكتروني أو الرقم القومي *
                </label>
              </div>
              <input
                type="text"
                {...register("identifier", {
                  required: "البريد الإلكتروني أو الرقم القومي مطلوب",
                })}
                className={InputClass}
                placeholder="ادخل البريد الإلكتروني أو الرقم القومي"
              />
              <p className="mt-1 min-h-5 text-xs text-red-600">
                {errors.identifier?.message || " "}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-2">
                <Lock className="h-5 w-5 text-emerald-600" />
                <label className="text-sm font-medium text-gray-700">
                  كلمة المرور *
                </label>
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-500 transition hover:text-emerald-600"
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeOff className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="mt-1 min-h-5 text-xs text-red-600">
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
              className="w-full cursor-pointer rounded-lg bg-emerald-600 py-3 text-base font-bold text-white shadow-md transition-transform hover:bg-emerald-700 hover:shadow-lg disabled:opacity-50"
            >
              {isSubmitting || isPending
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
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
