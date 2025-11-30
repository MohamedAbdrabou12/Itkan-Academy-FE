import { useEffect } from "react";
import {
  useForm,
  useWatch,
  FormProvider,
  type SubmitHandler,
  type Resolver,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "../shared/Modal";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useGetClassesByBranchs } from "@/hooks/classes/useGetClassesByBranchs";
import { studentSchema, type StudentFormData } from "@/validation/studentSchema";
import HookFormInput from "../forms/HookFormInput";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import HookFormSelect from "../forms/HookFormSelect";
import { z } from "zod";

const studentUiSchema = studentSchema.extend({
  branch_ids: z.array(z.string()).min(1).max(1),
  class_ids: z.array(z.string()).optional().default([]),
  phone: z.string().min(1, "رقم الهاتف مطلوب"),
  status: z.enum(["pending", "active", "rejected", "deactive"]),
});

type StudentFormUiData = z.infer<typeof studentUiSchema>;

interface StudentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData & { student_id?: number }) => Promise<void>;
  initialData?: StudentFormData & { student_id?: number };
  isSubmitting?: boolean;
  isEditing?: boolean;
  refetchStudents?: () => void;
}

export const StudentFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  isEditing = false,
  refetchStudents,
}: StudentFormModalProps) => {
  const isCreateMode = !isEditing;

  const form = useForm<StudentFormUiData>({
    resolver: zodResolver(studentUiSchema) as Resolver<StudentFormUiData>,
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      branch_ids: [],
      class_ids: [],
      admission_date: new Date().toISOString().split("T")[0],
      status: "pending",
    },
  });

  const selectedBranchs = useWatch({ name: "branch_ids", control: form.control });
  const { branches } = useGetAllBranches();
  const { classes } = useGetClassesByBranchs(selectedBranchs);

  const branchesOptions = branches.map((branch) => ({ value: `${branch.id}`, label: branch.name }));
  const classesOptions = classes?.map((cls) => ({ value: `${cls.id}`, label: cls.name })) || [];
  const statusOptions = [
    { value: "pending", label: "معلق" },
    { value: "active", label: "نشط" },
    { value: "rejected", label: "مرفوض" },
    { value: "deactive", label: "غير نشط" },
  ];

  const onCloseHandler = () => {
    form.reset();
    onClose();
  };

  const onSubmitHandler: SubmitHandler<StudentFormUiData> = async (data) => {
    const apiData: StudentFormData & { student_id?: number } = {
      ...data,
      phone: data.phone?.trim() || "",
      branch_ids: data.branch_ids.map(Number),
      class_ids: data.class_ids?.map(Number) || [],
      admission_date: data.admission_date,
      status: data.status,
      student_id: initialData?.student_id,
    };

    await onSubmit(apiData);
    refetchStudents?.();
    onCloseHandler();
  };

  useEffect(() => {
    if (!isOpen) {
      form.reset();
      return;
    }

    if (initialData) {
      const safeStatus = initialData.status
        ? (initialData.status.toLowerCase() as "pending" | "active" | "rejected" | "deactive")
        : "pending";

      form.reset({
        full_name: initialData.full_name,
        email: initialData.email,
        phone: initialData.phone || "",
        branch_ids: initialData.branch_ids.map(String),
        class_ids: initialData.class_ids?.map(String) || [],
        admission_date: initialData.admission_date
          ? new Date(initialData.admission_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: safeStatus,
      });
    } else {
      form.reset({
        full_name: "",
        email: "",
        phone: "",
        branch_ids: [],
        class_ids: [],
        admission_date: new Date().toISOString().split("T")[0],
        status: "pending",
      });
    }
  }, [initialData, isOpen, form]);

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmitHandler)}>
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput label="الاسم الكامل" name="full_name" placeholder="ادخل اسم الطالب" required />
            <HookFormInput label="البريد الإلكتروني" name="email" type="email" placeholder="example@domain.com" required />
            <HookFormInput label="رقم الهاتف" name="phone" placeholder="رقم الهاتف" required />

            <HookFormMultiSelect label="الفرع" name="branch_ids" required options={branchesOptions} placeholder="اختر فرع واحد فقط" />
            <HookFormMultiSelect label="الفصول" name="class_ids" disabled={!selectedBranchs?.length} options={classesOptions} placeholder="اختر الفصول" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <HookFormInput label="تاريخ القبول" name="admission_date" type="date" required disabled={isCreateMode} />
              <HookFormSelect label="الحالة" name="status" options={statusOptions} placeholder="اختر الحالة" disabled={isCreateMode} />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onCloseHandler} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              إلغاء
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50">
              {isSubmitting ? "جاري الحفظ..." : isEditing ? "تحديث" : "إضافة"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};