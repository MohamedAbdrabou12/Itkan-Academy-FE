import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import {
  curriculumSchema,
  type CurriculumFormData,
  type CurriculumFormInput,
} from "@/validation/curriculum";

import { useCreateCurriculum } from "@/hooks/curriculums/useCreateCurriculum";
import { useUpdateCurriculum } from "@/hooks/curriculums/useUpdateCurriculum";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";
import { Modal } from "../shared/Modal";

interface CurriculumFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (CurriculumFormData & { id: number }) | null;
}

export const CurriculumFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: CurriculumFormModalProps) => {
  const createMutation = useCreateCurriculum();
  const updateMutation = useUpdateCurriculum();

  const form = useForm<CurriculumFormInput>({
    resolver: zodResolver(curriculumSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      academic_year: "",
      is_active: "true", // UI expects string
    },
  });

  const statusOptions = [
    { value: "true", label: "نشط" },
    { value: "false", label: "غير نشط" },
  ];

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: CurriculumFormData) => {
    console.log(data);
    // 'data.is_active' is now exactly what was selected (boolean)
    if (initialValues) {
      await updateMutation.mutateAsync({ id: initialValues.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onCloseHandler();
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name,
        description: initialValues.description,
        academic_year: initialValues.academic_year,
        // Sync the UI: convert boolean from database to string for the Select component
        is_active: String(initialValues.is_active),
      });
    } else {
      form.reset({
        name: "",
        description: "",
        academic_year: "",
        is_active: "true",
      });
    }
  }, [initialValues, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmitHandler as unknown as SubmitHandler<CurriculumFormInput>,
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="اسم المستوى الدراسى"
              name="name"
              placeholder="ادخل اسم المستوى الدراسى"
              required
            />

            <HookFormInput
              label="السنة الأكاديمية"
              name="academic_year"
              placeholder="مثال: 2024-2025"
              required
            />

            <HookFormInput
              label="الوصف"
              name="description"
              placeholder="ادخل وصف المستوى الدراسى"
            />

            <HookFormSelect
              label="حالة المستوى الدراسى"
              name="is_active"
              required
              options={statusOptions}
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCloseHandler}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "جاري الحفظ..." : initialValues ? "حفظ" : "اضافة"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
