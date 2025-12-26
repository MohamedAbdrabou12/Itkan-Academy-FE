import apiReq from "@/services/apiReq";
import { ParentStatus, RelationshipType } from "@/types/Parents";
import {
  parentCreateSchema,
  parentUpdateSchema,
  type ParentCreateForm,
  type ParentUpdateForm,
} from "@/validation/parentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Briefcase, Mail, MapPin, Phone, Search, User } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type Resolver,
  type SubmitHandler,
} from "react-hook-form";
import { z } from "zod";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";

const phoneRegex = /^01[0125][0-9]{8}$/;

const parentBaseFormSchema = z.object({
  children_ids: z.array(z.number()).optional().nullable(),
});

const ExtendedCreateSchema = parentCreateSchema
  .merge(parentBaseFormSchema)
  .extend({
    phone: z
      .string()
      .regex(phoneRegex, "يجب أن يكون رقم الهاتف 11 رقم ويبدأ بـ 01"),
    occupation: z.string().min(2, "الوظيفة مطلوبة"),
    address: z.string().min(5, "العنوان مطلوب"),
    status: z.nativeEnum(ParentStatus).default(ParentStatus.PENDING),
  });

const ExtendedUpdateSchema = parentUpdateSchema.merge(
  parentBaseFormSchema.partial(),
);

type FormData = z.infer<typeof ExtendedCreateSchema> &
  z.infer<typeof ExtendedUpdateSchema>;

type ParentFormSubmitData =
  | (ParentCreateForm & { children_ids: number[] })
  | (ParentUpdateForm & { parent_id: number; children_ids: number[] });

type ParentFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParentFormSubmitData) => Promise<void>;
  initialData?: {
    id: number;
    occupation?: string | null;
    address?: string | null;
    relationship_type: RelationshipType;
    user: { full_name: string; email: string; phone?: string | null };
    children?: {
      student_id: number;
      full_name?: string;
      email?: string | null;
    }[];
    status?: ParentStatus;
  };
  isEditing?: boolean;
  isSubmitting?: boolean;
  apiError?: string | null;
};

type StudentOption = {
  student_id: number;
  full_name: string;
  email?: string | null;
};

const ICONS: Record<string, ReactNode> = {
  full_name: <User size={16} className="text-emerald-600" />,
  email: <Mail size={16} className="text-emerald-600" />,
  phone: <Phone size={16} className="text-emerald-600" />,
  occupation: <Briefcase size={16} className="text-emerald-600" />,
  address: <MapPin size={16} className="text-emerald-600" />,
};

const relationshipOptions = [
  { value: RelationshipType.FATHER, label: "أب" },
  { value: RelationshipType.MOTHER, label: "أم" },
  { value: RelationshipType.GUARDIAN, label: "ولي" },
];

const statusOptions = [
  { value: ParentStatus.ACTIVE, label: "نشط" },
  { value: ParentStatus.PENDING, label: "معلق" },
  { value: ParentStatus.REJECTED, label: "مرفوض" },
  { value: ParentStatus.DEACTIVE, label: "مغلق" },
];

export const ParentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isEditing = false,
  isSubmitting = false,
  apiError = null,
}: ParentFormModalProps) => {
  const schema = isEditing ? ExtendedUpdateSchema : ExtendedCreateSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      occupation: "",
      address: "",
      relationship_type: RelationshipType.FATHER,
      status: ParentStatus.PENDING,
      children_ids: [],
    } as FormData,
  });

  const [selectedStudents, setSelectedStudents] = useState<StudentOption[]>([]);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<StudentOption[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const onCloseHandler = useMemo(() => {
    return () => {
      form.reset();
      setSelectedStudents([]);
      onClose();
    };
  }, [form, onClose]);

  useEffect(() => {
    if (!isOpen) {
      onCloseHandler();
      return;
    }

    if (initialData) {
      form.reset({
        full_name: initialData.user.full_name,
        email: initialData.user.email,
        phone: initialData.user.phone ?? "",
        occupation: initialData.occupation ?? "",
        address: initialData.address ?? "",
        relationship_type: initialData.relationship_type,
        status: initialData.status ?? ParentStatus.PENDING,
        children_ids: initialData.children?.map((c) => c.student_id) ?? [],
      } as FormData);

      setSelectedStudents(
        initialData.children?.map((c) => ({
          student_id: c.student_id,
          full_name: c.full_name ?? `ID ${c.student_id}`,
          email: c.email ?? null,
        })) ?? [],
      );
    }
  }, [initialData, isOpen, form, onCloseHandler]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = (await apiReq(
          "GET",
          `/students/?search=${encodeURIComponent(query)}&size=10`,
        )) as {
          items: StudentOption[];
        };
        setSuggestions(
          res.items.filter(
            (it) =>
              !selectedStudents.some((s) => s.student_id === it.student_id),
          ),
        );
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedStudents]);

  const addStudent = (s: StudentOption) => {
    setSelectedStudents((prev) => [...prev, s]);
    setQuery("");
    setSuggestions([]);
  };

  const removeStudent = (id: number) => {
    setSelectedStudents((prev) => prev.filter((s) => s.student_id !== id));
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    const childrenIds = selectedStudents.map((s) => s.student_id);
    let payload: ParentFormSubmitData;

    if (isEditing && initialData) {
      payload = {
        ...(data as ParentUpdateForm),
        parent_id: initialData.id,
        children_ids: childrenIds,
      };
    } else {
      payload = {
        ...(data as ParentCreateForm),
        children_ids: childrenIds,
      };
    }

    onSubmit(payload).catch(() => {});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-center text-xl font-semibold text-emerald-700">
          {isEditing ? "تعديل ولي الأمر" : "إضافة ولي أمر جديد"}
        </h3>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmitHandler)}
            autoComplete="off"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {apiError && (
                <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 md:col-span-2">
                  <strong className="font-bold">خطأ: </strong>
                  <span>{apiError}</span>
                </div>
              )}

              <HookFormInput
                label="الاسم الكامل"
                name="full_name"
                placeholder="ادخل الاسم الكامل"
                required
                icon={ICONS.full_name}
              />
              <HookFormInput
                label="البريد الإلكتروني"
                name="email"
                type="email"
                placeholder="example@domain.com"
                required
                icon={ICONS.email}
              />
              <HookFormInput
                label="الهاتف"
                name="phone"
                placeholder="ادخل رقم الهاتف"
                required
                icon={ICONS.phone}
              />
              <HookFormInput
                label="الوظيفة"
                name="occupation"
                placeholder="ادخل الوظيفة"
                required
                icon={ICONS.occupation}
              />
              <HookFormInput
                label="العنوان"
                name="address"
                placeholder="ادخل العنوان التفصيلي"
                required
                icon={ICONS.address}
              />

              <HookFormSelect
                label="نوع العلاقة"
                name="relationship_type"
                options={relationshipOptions}
                required
              />
              <HookFormSelect
                label="الحالة"
                name="status"
                options={statusOptions}
                disabled={!isEditing}
                required
              />

              <div className="relative md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  الأبناء المرتبطين
                </label>

                <div className="mb-3 flex min-h-[45px] flex-wrap gap-2 rounded-lg border border-gray-300 bg-gray-50/50 p-2">
                  {selectedStudents.map((s) => (
                    <div
                      key={s.student_id}
                      className="animate-in fade-in zoom-in flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1 text-emerald-800 duration-200"
                    >
                      <span className="text-xs font-semibold">
                        {s.full_name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeStudent(s.student_id)}
                        className="transition hover:text-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {selectedStudents.length === 0 && (
                    <span className="self-center px-2 text-xs text-gray-400">
                      لم يتم اختيار طلاب بعد
                    </span>
                  )}
                </div>

                <div className="group relative">
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <Search
                      size={16}
                      className="text-gray-400 transition-colors group-focus-within:text-emerald-600"
                    />
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2.5 pr-10 text-sm shadow-sm transition-all placeholder:text-gray-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                    placeholder="ابحث عن طالب بالاسم أو البريد وأضفه..."
                  />
                </div>

                {loadingSuggestions && (
                  <div className="mt-2 flex items-center gap-2 px-2 text-xs text-emerald-600">
                    جارٍ البحث...
                  </div>
                )}

                {!loadingSuggestions && query && suggestions.length > 0 && (
                  <div className="absolute right-0 z-50 mt-1 max-h-48 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl">
                    {suggestions.slice(0, 10).map((s) => (
                      <button
                        key={s.student_id}
                        type="button"
                        onClick={() => addStudent(s)}
                        className="w-full border-b border-gray-50 px-4 py-3 text-right transition-colors last:border-0 hover:bg-emerald-50"
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {s.full_name}
                        </div>
                        <div className="text-xs text-gray-500">{s.email}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t border-emerald-600 pt-5">
              <button
                type="button"
                onClick={onCloseHandler}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
                disabled={isSubmitting}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-emerald-600 px-8 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting
                  ? "جاري الحفظ..."
                  : isEditing
                    ? "تحديث البيانات"
                    : "إضافة ولي الأمر"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ParentFormModal;
