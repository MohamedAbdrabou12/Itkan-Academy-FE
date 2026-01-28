import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import HookFormInput from "../forms/HookFormInput";
import { Modal } from "../shared/Modal";
import {
  unitSchema,
  type UnitFormData,
  type UnitFormInput,
} from "@/validation/unitSchema";
import { useCreateUnit } from "@/hooks/units/useCreateUnit";
import { useUpdateUnit } from "@/hooks/units/useUpdateUnit";
import HookFormSelect from "../forms/HookFormSelect";
import { useGetAllCurriculums } from "@/hooks/curriculums/useGetAllCurriculums";

interface UnitFormModalProps {
  onClose: () => void;
  initialValues: (UnitFormData & { id: number }) | null;
  subject_id: string;
}

const UnitFormModal = ({
  onClose,
  initialValues,
  subject_id,
}: UnitFormModalProps) => {
  const createMutation = useCreateUnit();
  const updateMutation = useUpdateUnit();

  const form = useForm<UnitFormData>({
    resolver: zodResolver(unitSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      curriculum_id: "",
      subject_id,
    },
  });

  const { curriculums } = useGetAllCurriculums({ size: 100, page: 1 });

  const curriculumOptions = curriculums.map((curriculum) => ({
    value: curriculum.id.toString(),
    label: curriculum.name,
  }));

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: UnitFormData) => {
    if (initialValues) {
      await updateMutation.mutateAsync({
          ...data,
          id: initialValues.id,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
    onCloseHandler();
  };

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    } else {
      form.reset({
        title: "",
        description: "",
        curriculum_id: "",
        subject_id: subject_id,
      });
    }
  }, [initialValues, form, subject_id]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmitHandler as unknown as SubmitHandler<UnitFormInput>,
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="اسم الوحدة"
              name="title"
              placeholder="ادخل اسم الوحدة"
              required
            />
            <HookFormInput
              label="وصف الوحدة"
              name="description"
              placeholder="ادخل وصف الوحدة"
            />
            <HookFormSelect
              label="المستوى الدراسى"
              name="curriculum_id"
              required
              options={curriculumOptions}
              placeholder="اختر المستوى الدراسى"
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

export default UnitFormModal;
