import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";

import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useGetClassesByBranches } from "@/hooks/classes/useGetClassesByBranches";
import { type StudentDetails } from "@/types/Students";
import {
  type StudentCreateFormData,
  type StudentUpdateFormData,
} from "@/validation/studentSchema";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import HookFormInput from "../forms/HookFormInput";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import HookFormSelect from "../forms/HookFormSelect";

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string | string[];
    };
  };
}

const formSchema = z
  .object({
    full_name: z.string().min(1, "اسم الطالب مطلوب"),
    national_id: z
      .string()
      .regex(/^\d{14}$/, "الرقم القومي يجب أن يكون 14 رقم"),
    email: z
      .string()
      .optional()
      .nullable()
      .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
        message: "البريد الإلكتروني غير صحيح",
      }),
    phone: z
      .string()
      .regex(
        /^01[0125]\d{8}$/,
        "رقم الهاتف غير صحيح، يجب أن يكون 11 رقم ويبدأ بـ 01",
      ),
    branch_ids: z.string().min(1, "يجب اختيار فرع واحد"),
    class_ids: z.array(z.string()).min(1, "يجب اختيار فصل واحد على الأقل"),
    status: z.enum(["pending", "active", "rejected", "deactive"]),
    admission_date: z.string().optional(),
    password: z.string().optional(),
    confirm_password: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password && data.password !== data.confirm_password) {
        return false;
      }
      return true;
    },
    {
      message: "كلمتا المرور غير متطابقتين",
      path: ["confirm_password"],
    },
  );

type StudentFormUiData = z.infer<typeof formSchema>;

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: (StudentCreateFormData | StudentUpdateFormData) & {
      student_id?: number;
    },
  ) => Promise<void>;
  initialData?: StudentDetails | null;
  isSubmitting?: boolean;
  isEditing?: boolean;
  refetchStudents?: () => void;
  apiError?: string | null;
}

const ICONS: Record<string, ReactNode> = {
  full_name: <User size={16} className="text-emerald-600" />,
  email: <Mail size={16} className="text-emerald-600" />,
  phone: <Phone size={16} className="text-emerald-600" />,
  national_id: <CreditCard size={16} className="text-emerald-600" />,
  date: <Calendar size={16} className="text-emerald-600" />,
  lock: <Lock size={16} className="text-emerald-600" />,
};

const statusOptions = [
  { value: "pending", label: "معلق" },
  { value: "active", label: "نشط" },
  { value: "rejected", label: "مرفوض" },
  { value: "deactive", label: "غير نشط" },
];

export const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  isEditing = false,
  refetchStudents,
  apiError = null,
}: StudentFormModalProps) => {
  const isCreateMode = !isEditing;
  const [showPassword, setShowPassword] = useState(false);
  const [localApiError, setLocalApiError] = useState<string | null>(
    apiError || null,
  );

  const form = useForm<StudentFormUiData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      national_id: "",
      email: "",
      phone: "",
      branch_ids: "",
      class_ids: [],
      status: "active",
      admission_date: new Date().toISOString().split("T")[0],
      password: "",
      confirm_password: "",
    },
  });

  const selectedBranch = useWatch({
    name: "branch_ids",
    control: form.control,
  });

  const { branches } = useGetAllBranches();
  const { classes } = useGetClassesByBranches(
    selectedBranch ? [selectedBranch] : [],
  );

  const branchesOptions = useMemo(
    () => branches.map((b) => ({ value: String(b.id), label: b.name })),
    [branches],
  );

  const classesOptions = useMemo(
    () => classes?.map((c) => ({ value: String(c.id), label: c.name })) || [],
    [classes],
  );

  const onCloseHandler = () => {
    form.reset();
    setLocalApiError(null);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setLocalApiError(apiError || null);
      if (initialData) {
        form.reset({
          full_name: initialData.full_name,
          national_id: initialData.national_id,
          email: initialData.email || "",
          phone: initialData.phone ?? "",
          branch_ids: initialData.branch_ids?.length
            ? String(initialData.branch_ids[0])
            : "",
          class_ids: initialData.class_ids?.map(String) || [],
          status: initialData.status as StudentFormUiData["status"],
          admission_date: initialData.admission_date?.split("T")[0] || "",
          password: "",
          confirm_password: "",
        });
      } else {
        form.reset({
          full_name: "",
          national_id: "",
          email: "",
          phone: "",
          branch_ids: "",
          class_ids: [],
          status: "active",
          admission_date: new Date().toISOString().split("T")[0],
          password: "",
          confirm_password: "",
        });
      }
    }
  }, [initialData, isOpen, form, apiError]);

  const onSubmitHandler: SubmitHandler<StudentFormUiData> = async (data) => {
    setLocalApiError(null);

    if (isCreateMode && !data.password) {
      form.setError("password", {
        type: "manual",
        message: "كلمة المرور مطلوبة عند إضافة طالب جديد",
      });
      return;
    }

    const basePayload = {
      ...data,
      email: !data.email || data.email.trim() === "" ? null : data.email,
      branch_ids: [Number(data.branch_ids)],
      class_ids: data.class_ids.map(Number),
      student_id: initialData?.student_id,
    };

    try {
      await onSubmit(basePayload as unknown as StudentCreateFormData);
      refetchStudents?.();
      onCloseHandler();
    } catch (error: unknown) {
      const apiErr = error as ApiErrorResponse;
      const rawMessage = apiErr.response?.data?.message || "";
      const errorMessage = Array.isArray(rawMessage)
        ? rawMessage.join(" ")
        : String(rawMessage);

      if (errorMessage.includes("national_id")) {
        form.setError("national_id", {
          type: "manual",
          message: "هذا الرقم القومي مسجل مسبقاً",
        });
      } else if (errorMessage.includes("email")) {
        form.setError("email", {
          type: "manual",
          message: "هذا البريد الإلكتروني مستخدم من قبل",
        });
      } else {
        setLocalApiError(
          errorMessage ||
            "الرقم القومي او البريد الالكتروني موجود مسبقا, يرجى المحاولة مرة أخرى",
        );
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-right text-xl font-semibold text-emerald-700">
          {isEditing ? "تعديل بيانات الطالب" : "إضافة طالب جديد"}
        </h3>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            autoComplete="off"
            className="text-right"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {localApiError && (
                <div
                  className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 md:col-span-2"
                  role="alert"
                >
                  <AlertCircle size={18} />
                  <span className="text-sm font-medium">{localApiError}</span>
                </div>
              )}

              <HookFormInput
                label="الاسم الكامل"
                name="full_name"
                placeholder="اسم الطالب الرباعي"
                required
                icon={ICONS.full_name}
              />

              <HookFormInput
                label="الرقم القومي"
                name="national_id"
                placeholder="ادخل الـ 14 رقم"
                required
                icon={ICONS.national_id}
              />

              <HookFormInput
                label="البريد الإلكتروني (اختياري)"
                name="email"
                type="email"
                placeholder="example@domain.com"
                icon={ICONS.email}
              />

              <HookFormInput
                label="رقم الهاتف"
                name="phone"
                placeholder="ادخل رقم الهاتف"
                required
                icon={ICONS.phone}
              />

              {isCreateMode && (
                <div className="grid grid-cols-1 gap-4 md:col-span-2 md:grid-cols-2">
                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      كلمة المرور <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
                        {ICONS.lock}
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...form.register("password")}
                        className={`w-full rounded-md border ${form.formState.errors.password ? "border-red-500" : "border-gray-300"} p-2 pl-10 pr-10 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                        placeholder="ادخل كلمة المرور"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-emerald-600"
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {form.formState.errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {form.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="relative">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      تأكيد كلمة المرور <span className="text-red-500">*</span>
                    </label>
                    <div className="group relative">
                      <div className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
                        {ICONS.lock}
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        {...form.register("confirm_password")}
                        className={`w-full rounded-md border ${form.formState.errors.confirm_password ? "border-red-500" : "border-gray-300"} p-2 pl-10 pr-10 shadow-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`}
                        placeholder="تأكيد كلمة المرور"
                      />
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-emerald-600"
                      >
                        {showPassword ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </div>
                    {form.formState.errors.confirm_password && (
                      <p className="mt-1 text-xs text-red-500">
                        {String(form.formState.errors.confirm_password.message)}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="md:col-span-2">
                <HookFormSelect
                  label="الفرع"
                  name="branch_ids"
                  required
                  options={branchesOptions}
                  placeholder="اختر الفرع"
                />
              </div>

              <div className="md:col-span-2">
                <HookFormMultiSelect
                  label="الفصول"
                  name="class_ids"
                  required
                  disabled={!selectedBranch}
                  options={classesOptions}
                  placeholder="اختر الفصول الدراسية"
                />
              </div>

              <HookFormInput
                label="تاريخ القبول"
                name="admission_date"
                type="date"
                required
                disabled
                icon={ICONS.date}
              />

              <HookFormSelect
                label="الحالة"
                name="status"
                options={statusOptions}
                required
                placeholder="اختر الحالة"
              />
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-emerald-600 pt-6">
              <button
                type="button"
                onClick={onCloseHandler}
                className="rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
                disabled={isSubmitting}
              >
                إلغاء
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary"
              >
                {isSubmitting
                  ? "جاري الحفظ..."
                  : isEditing
                    ? "تحديث"
                    : "إضافة الطالب"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default StudentFormModal;
