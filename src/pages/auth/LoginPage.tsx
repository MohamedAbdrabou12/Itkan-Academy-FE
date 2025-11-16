import { useLogin } from "@/hooks/auth/useLogin";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

interface LoginFormData {
  email: string;
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
    login({ email: data.email, password: data.password });
  };

  return (
    <div className="bg-linear-to-br flex min-h-screen items-center justify-center from-emerald-50 to-teal-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-2">
              <BookOpen className="h-10 w-10 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">
                مدرسة الإتقان
              </span>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              تسجيل الدخول
            </h2>
            <p className="text-gray-600">مرحباً بك مجدداً</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="email"
                  {...register("email", {
                    required: "البريد الإلكتروني مطلوب",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "البريد الإلكتروني غير صالح",
                    },
                  })}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-semibold text-gray-700">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
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

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full rounded-lg bg-emerald-600 py-3 text-lg font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting || isPending
                ? "جاري تسجيل الدخول..."
                : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ليس لديك حساب؟{" "}
              <Link
                to="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                سجل الآن
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
