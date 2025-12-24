import { useRegister } from "@/hooks/auth/useRegister";
import type { RegisterFormData as RegisterPayload } from "@/hooks/auth/useRegister";
import { User, Mail, Phone, Lock, BookOpen, Eye, EyeOff, ClipboardList } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import RegisterImage from "@/components/assets/5.jpg";

interface RegisterFormData {
  full_name: string;
  email?: string;
  phone: string;
  national_id: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();

  const [showPasswords, setShowPasswords] = useState(false);
  const { register: registerUser, isPending } = useRegister();

  const onSubmit = async (data: RegisterFormData) => {
    const payload: RegisterPayload = {
      full_name: data.full_name,
      phone: data.phone,
      national_id: data.national_id,
      password: data.password,
    };
    if (data.email) payload.email = data.email;
    registerUser(payload);
  };

  const InputClass =
    "w-full rounded-lg border border-gray-300 py-3 px-6 shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 transition-all";

  const PasswordInputClass =
    "w-full rounded-lg border border-gray-300 py-3 px-6 shadow-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600 transition-all";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:py-20">
      <AnimatePresence>
        <motion.section
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-5"
        >
          <div className="p-8 sm:p-12 lg:p-14 order-2 lg:order-1 lg:col-span-3">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-2">
                <BookOpen className="h-8 w-8 text-emerald-600" />
                <span className="text-xl font-extrabold text-gray-900">مدرسة الإتقان</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">تسجيل طالب جديد</h2>
              <p className="text-gray-500 text-sm">ابدأ رحلتك في حفظ القرآن الكريم</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-5 w-5 text-emerald-600" />
                    <label className="text-sm font-medium text-gray-700">الاسم الكامل *</label>
                  </div>
                  <input
                    type="text"
                    {...register("full_name", {
                      required: "الاسم الكامل مطلوب",
                      minLength: { value: 2, message: "الاسم يجب أن يكون على الأقل حرفين" },
                    })}
                    className={InputClass}
                    placeholder="ادخل الاسم الكامل"
                  />
                  <p className="mt-1 text-xs text-red-600 min-h-5">{errors.full_name?.message || " "}</p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <label className="text-sm font-medium text-gray-700">رقم الهاتف *</label>
                  </div>
                  <input
                    type="text"
                    {...register("phone", {
                      required: "رقم الهاتف مطلوب",
                      pattern: { value: /^01\d{9}$/, message: "رقم الهاتف يجب أن يبدأ بـ 01 ويحتوي على 11 أرقام" },
                    })}
                    className={InputClass}
                    placeholder="ادخل رقم الهاتف"
                  />
                  <p className="mt-1 text-xs text-red-600 min-h-5">{errors.phone?.message || " "}</p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Mail className="h-5 w-5 text-emerald-600" />
                    <label className="text-sm font-medium text-gray-700">البريد الإلكتروني</label>
                  </div>
                  <input
                    type="email"
                    {...register("email", {
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "البريد الإلكتروني غير صالح" },
                    })}
                    className={InputClass}
                    placeholder="example@email.com"
                  />
                  <p className="mt-1 text-xs text-red-600 min-h-5">{errors.email?.message || " "}</p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="h-5 w-5 text-emerald-600" />
                    <label className="text-sm font-medium text-gray-700">الرقم القومي *</label>
                  </div>
                  <input
                    type="text"
                    {...register("national_id", {
                      required: "الرقم القومي مطلوب",
                      minLength: { value: 14, message: "الرقم القومي يجب أن يكون 14 رقم" },
                      maxLength: { value: 14, message: "الرقم القومي يجب أن يكون 14 رقم" },
                    })}
                    className={InputClass}
                    placeholder="ادخل الرقم القومي"
                  />
                  <p className="mt-1 text-xs text-red-600 min-h-5">{errors.national_id?.message || " "}</p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="h-5 w-5 text-emerald-600" />
                    <label className="text-sm font-medium text-gray-700">كلمة المرور *</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      {...register("password", {
                        required: "كلمة المرور مطلوبة",
                        minLength: { value: 8, message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل" },
                      })}
                      className={PasswordInputClass}
                      placeholder="ادخل كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => !prev)}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                    >
                      {showPasswords ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className={`mt-1 text-xs ${errors.password ? "text-red-600" : "text-gray-500"} min-h-5`}>
                    {errors.password?.message || "8 أحرف على الأقل"}
                  </p>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="h-5 w-5 text-emerald-600" />
                    <label className="text-sm font-medium text-gray-700">تأكيد كلمة المرور *</label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPasswords ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "تأكيد كلمة المرور مطلوب",
                        validate: value =>
                          value === getValues("password") || "كلمة المرور غير متطابقة",
                      })}
                      className={PasswordInputClass}
                      placeholder="اعد كتابة كلمة المرور"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswords(prev => !prev)}
                      className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-500 hover:text-emerald-600 transition"
                    >
                      {showPasswords ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-red-600 min-h-5">{errors.confirmPassword?.message || " "}</p>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting || isPending}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="w-full rounded-lg bg-emerald-600 py-3 text-base font-bold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition disabled:opacity-50"
              >
                {isSubmitting || isPending ? "جاري التسجيل..." : "إتمام التسجيل"}
              </motion.button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                لديك حساب بالفعل؟{" "}
                <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </div>

          <div className="relative h-64 lg:h-auto order-1 lg:order-2 lg:col-span-2 bg-black">
            <img
              src={RegisterImage}
              alt="Quran background"
              className="absolute inset-0 h-full w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-emerald-700/40 backdrop-brightness-100"></div>
          </div>
        </motion.section>
      </AnimatePresence>
    </div>
  );
}