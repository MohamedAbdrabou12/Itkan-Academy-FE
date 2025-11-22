import { useRegister } from "@/hooks/auth/useRegister";
import { BookOpen, Lock, Mail, Phone, User, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

interface RegisterFormData {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isPending } = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    const payload = {
      full_name: data.full_name,
      email: data.email,
      phone: data.phone,
      password: data.password,
    };
    registerUser(payload);
  };

  return (
    <div className="bg-linear-to-br min-h-screen from-emerald-50 to-teal-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center space-x-2 space-x-reverse">
              <BookOpen className="h-10 w-10 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">مدرسة الإتقان</span>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">تسجيل طالب جديد</h2>
            <p className="text-gray-600">ابدأ رحلتك في حفظ القرآن الكريم</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">الاسم الكامل *</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      {...register("full_name", { required: "الاسم الكامل مطلوب", minLength: { value: 2, message: "الاسم يجب أن يكون على الأقل حرفين" } })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="ادخل الاسم الكامل"
                    />
                  </div>
                  {errors.full_name && <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">رقم الجوال *</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="tel"
                      {...register("phone", { required: "رقم الجوال مطلوب", pattern: { value: /^01\d{9}$/, message: "رقم الجوال يجب أن يبدأ بـ 01 ويحتوي على 11 أرقام" } })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">البريد الإلكتروني *</label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="email"
                      {...register("email", { required: "البريد الإلكتروني مطلوب", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "البريد الإلكتروني غير صالح" } })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="example@email.com"
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">كلمة المرور *</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", { required: "كلمة المرور مطلوبة", minLength: { value: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" } })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password ? <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : <p className="mt-1 text-xs text-gray-500">8 أحرف على الأقل</p>}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">تأكيد كلمة المرور *</label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", { 
                        required: "تأكيد كلمة المرور مطلوب", 
                        validate: value => value === getValues("password") || "كلمة المرور غير متطابقة"
                      })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600">
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full rounded-lg bg-emerald-600 py-4 text-lg font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {isSubmitting || isPending ? "جاري التسجيل..." : "إتمام التسجيل"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{" "}
              <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}