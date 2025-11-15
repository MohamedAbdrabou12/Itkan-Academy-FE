import { useRegister } from "@/hooks/auth/useRegister";
import {
  BookOpen,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

interface RegisterFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  branch: string;
  studentName: string;
  studentAge: string;
  program: string;
}

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isPending } = useRegister();

  const password = watch("password");

  const onSubmit = async (data: RegisterFormData) => {
    registerUser(data);
  };

  return (
    <div className="bg-linear-to-br min-h-screen from-emerald-50 to-teal-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center space-x-2 space-x-reverse">
              <BookOpen className="h-10 w-10 text-emerald-600" />
              <span className="text-2xl font-bold text-gray-900">
                مدرسة الإتقان
              </span>
            </div>
            <h2 className="mb-2 text-3xl font-bold text-gray-900">
              تسجيل طالب جديد
            </h2>
            <p className="text-gray-600">ابدأ رحلتك في حفظ القرآن الكريم</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                بيانات الطالب
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    اسم الطالب *
                  </label>
                  <input
                    type="text"
                    {...register("studentName", {
                      required: "اسم الطالب مطلوب",
                      minLength: {
                        value: 2,
                        message: "اسم الطالب يجب أن يكون على الأقل حرفين",
                      },
                    })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                    placeholder="أدخل اسم الطالب"
                  />
                  {errors.studentName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.studentName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    العمر *
                  </label>
                  <input
                    type="number"
                    {...register("studentAge", {
                      required: "العمر مطلوب",
                      min: {
                        value: 5,
                        message: "العمر يجب أن يكون 5 سنوات على الأقل",
                      },
                      max: {
                        value: 100,
                        message: "العمر يجب أن يكون 100 سنة على الأكثر",
                      },
                    })}
                    min="5"
                    max="100"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                    placeholder="أدخل العمر"
                  />
                  {errors.studentAge && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.studentAge.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block font-semibold text-gray-700">
                    البرنامج المرغوب *
                  </label>
                  <select
                    {...register("program", { required: "البرنامج مطلوب" })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="">اختر البرنامج</option>
                    <option value="memorization">برنامج الحفظ المتقن</option>
                    <option value="tajweed">برنامج التجويد المتخصص</option>
                    <option value="tafseer">برنامج التفسير والتدبر</option>
                  </select>
                  {errors.program && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.program.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                بيانات ولي الأمر
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    الاسم الكامل *
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="text"
                      {...register("name", {
                        required: "الاسم الكامل مطلوب",
                        minLength: {
                          value: 2,
                          message: "الاسم يجب أن يكون على الأقل حرفين",
                        },
                      })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="ادخل الاسم الكامل"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    رقم الجوال *
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type="tel"
                      {...register("phone", {
                        required: "رقم الجوال مطلوب",
                        pattern: {
                          value: /^01\d{9}$/,
                          message:
                            "رقم الجوال يجب أن يبدأ بـ 01 ويحتوي على 11 أرقام",
                        },
                      })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="01xxxxxxxxx"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    البريد الإلكتروني *
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
                    الفرع المرغوب *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <select
                      {...register("branch", { required: "الفرع مطلوب" })}
                      className="w-full appearance-none rounded-lg border border-gray-300 py-3 pl-4 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                    >
                      <option value="">اختر الفرع</option>
                      <option value="malqa">فرع الملقا</option>
                      <option value="narjis">فرع النرجس</option>
                      <option value="yasmin">فرع الياسمين</option>
                      <option value="olaya">فرع العليا</option>
                      <option value="rawda">فرع الروضة</option>
                      <option value="ghadeer">فرع الغدير</option>
                    </select>
                  </div>
                  {errors.branch && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.branch.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
              <h3 className="mb-4 text-xl font-bold text-gray-900">
                كلمة المرور
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "كلمة المرور مطلوبة",
                        minLength: {
                          value: 8,
                          message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
                        },
                      })}
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
                  {errors.password ? (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      8 أحرف على الأقل
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-semibold text-gray-700">
                    تأكيد كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword", {
                        required: "تأكيد كلمة المرور مطلوب",
                        validate: (value) =>
                          value === password || "كلمة المرور غير متطابقة",
                      })}
                      className="w-full rounded-lg border border-gray-300 py-3 pl-12 pr-10 focus:border-transparent focus:ring-2 focus:ring-emerald-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-600"
              />
              <label className="mr-3 text-sm text-gray-600">
                أوافق على
                <Link
                  to="/terms"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  الشروط والأحكام
                </Link>
                و
                <Link
                  to="/privacy"
                  className="font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  سياسة الخصوصية
                </Link>
              </label>
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
              <Link
                to="/login"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
