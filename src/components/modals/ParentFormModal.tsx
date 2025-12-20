import { useEffect, useState, useMemo, type ReactNode } from "react";
import { useForm, FormProvider, type SubmitHandler, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  parentCreateSchema,
  parentUpdateSchema,
  type ParentCreateForm,
  type ParentUpdateForm,
} from "@/validation/parentSchema";
import { RelationshipType, ParentStatus } from "@/types/Parents";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";
import apiReq from "@/services/apiReq";
import { User, Mail, Phone, Briefcase, MapPin } from "lucide-react";

const parentBaseFormSchema = z.object({
  children_ids: z.array(z.number()).optional().nullable(),
});

const ParentCreateFormSchema = parentCreateSchema.merge(parentBaseFormSchema);
const ParentUpdateFormSchema = parentUpdateSchema.merge(parentBaseFormSchema.partial());

type ParentFormBaseData = z.infer<typeof ParentCreateFormSchema>;

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
    children?: { student_id: number; full_name?: string; email?: string | null }[];
    status?: ParentStatus;
  };
  isEditing?: boolean;
  isSubmitting?: boolean;
  apiError?: string | null; 
};

type StudentOption = { student_id: number; full_name: string; email?: string | null };

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
  const schema = isEditing ? ParentUpdateFormSchema : ParentCreateFormSchema;
  type FormData = z.infer<typeof schema>;

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
    } as ParentFormBaseData as FormData,
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
      const statusValue = initialData.status ?? ParentStatus.PENDING;
      form.reset({
        full_name: initialData.user.full_name,
        email: initialData.user.email,
        phone: initialData.user.phone ?? "",
        occupation: initialData.occupation ?? "",
        address: initialData.address ?? "",
        relationship_type: initialData.relationship_type,
        status: statusValue,
        children_ids: initialData.children?.map((c) => c.student_id) ?? [],
      } as FormData);

      setSelectedStudents(
        initialData.children?.map((c) => ({
          student_id: c.student_id,
          full_name: c.full_name ?? `ID ${c.student_id}`,
          email: c.email ?? null,
        })) ?? []
      );
    } else {
      form.reset({
        full_name: "",
        email: "",
        phone: "",
        occupation: "",
        address: "",
        relationship_type: RelationshipType.FATHER,
        status: ParentStatus.PENDING,
        children_ids: [],
      } as FormData);
    }
  }, [initialData, isOpen, form, onCloseHandler]); 

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = (await apiReq("GET", `/students/?search=${encodeURIComponent(query)}&size=10`)) as {
          items: StudentOption[];
        };
        if (!cancelled)
          setSuggestions(res.items.filter((it) => !selectedStudents.some((s) => s.student_id === it.student_id)));
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoadingSuggestions(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, selectedStudents]);

  const suggestionsList = useMemo(() => suggestions.slice(0, 10), [suggestions]);

  const addStudent = (s: StudentOption) => {
    setSelectedStudents((prev) => [...prev, s]);
    setQuery("");
    setSuggestions([]);
  };

  const removeStudent = (id: number) => {
    setSelectedStudents((prev) => prev.filter((s) => s.student_id !== id));
  };

  const onSubmitHandler: SubmitHandler<FormData> = async (data) => {
    const cleanedData = Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        value === "" ? null : value,
      ])
    ) as FormData;

    const childrenIds = selectedStudents.map((s) => s.student_id);

    let payload: ParentFormSubmitData;

    if (isEditing && initialData) {
      payload = {
        ...(cleanedData as ParentUpdateForm),
        parent_id: initialData.id,
        children_ids: childrenIds,
      };
    } else {
      if (!cleanedData.full_name || !cleanedData.email || !cleanedData.relationship_type) return;
      payload = {
        ...(cleanedData as ParentCreateForm),
        children_ids: childrenIds,
      };
    }

    onSubmit(payload).then(() => {}).catch(() => {});
  };

  if (!isOpen) return null;

  const isSubmittingOrClosing = isSubmitting; 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold text-emerald-700 mb-6">
          {isEditing ? "تعديل ولي الأمر" : "إضافة ولي أمر جديد"}
        </h3>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmitHandler)} autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
              {apiError && (
                <div className="md:col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                  <strong className="font-bold">خطأ: </strong>
                  <span className="block sm:inline">{apiError}</span>
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
                label="الهاتف (اختياري)"
                name="phone"
                placeholder="ادخل رقم الهاتف"
                icon={ICONS.phone}
              />
              <HookFormInput
                label="الوظيفة (اختياري)"
                name="occupation"
                placeholder="ادخل الوظيفة"
                icon={ICONS.occupation}
              />
              <HookFormInput
                label="العنوان (اختياري)"
                name="address"
                placeholder="ادخل العنوان"
                icon={ICONS.address}
              />
              
              <HookFormSelect
                label="نوع العلاقة"
                name="relationship_type"
                options={relationshipOptions}
                placeholder="اختر نوع العلاقة"
                required
              />
              
              <HookFormSelect
                label="الحالة"
                name="status"
                options={statusOptions}
                placeholder="اختر الحالة"
                required
              />

              <div className="md:col-span-2 relative z-10">
                <label className="block text-sm font-medium text-gray-700 mb-1">إضافة / إزالة الأبناء المرتبطين</label>
                
                <div className="flex flex-wrap gap-2 mb-2 p-2 border border-gray-300 rounded-md min-h-10">
                  {selectedStudents.map((s) => (
                    <div
                      key={s.student_id}
                      className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-300"
                    >
                      <span className="text-sm font-medium">{s.full_name}</span>
                      <button
                        type="button"
                        onClick={() => removeStudent(s.student_id)}
                        className="text-sm text-emerald-600 hover:text-red-700 transition"
                        title="إزالة الطالب"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  {selectedStudents.length === 0 && <span className="text-sm text-gray-500">لا يوجد أبناء مرتبطين حالياً.</span>}
                </div>
                
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm p-2 mt-2 focus:border-emerald-500 focus:ring-emerald-500"
                  placeholder="ابحث عن طالب بالاسم أو البريد وأضفه..."
                />

                {loadingSuggestions && <div className="text-sm text-gray-500 mt-1 p-2">جارٍ البحث عن الطلاب...</div>}
                {!loadingSuggestions && query && suggestionsList.length > 0 && (
                  <div className="absolute right-0 mt-1 max-h-48 overflow-y-auto rounded-md border bg-white shadow-lg w-full z-20">
                    {suggestionsList.map((s) => (
                      <button
                        key={s.student_id}
                        type="button"
                        onClick={() => addStudent(s)}
                        className="w-full text-right px-3 py-2 hover:bg-gray-50 border-b last:border-b-0"
                      >
                        <div className="text-sm font-medium">{s.full_name}</div>
                        <div className="text-xs text-gray-500">{s.email}</div>
                      </button>
                    ))}
                  </div>
                )}
                {!loadingSuggestions && query && suggestionsList.length === 0 && (
                     <div className="text-sm text-gray-500 mt-1 p-2">لا توجد نتائج مطابقة.</div>
                )}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onCloseHandler}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                disabled={isSubmittingOrClosing}
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmittingOrClosing}
                className="rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition"
              >
                {isSubmittingOrClosing ? "جاري الحفظ..." : isEditing ? "تحديث" : "إضافة"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};

export default ParentFormModal;