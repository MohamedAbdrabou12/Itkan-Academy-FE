import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import HookFormInput from "../forms/HookFormInput";
import { Modal } from "../shared/Modal";
import {
  unitItemSchema,
  type UnitItemFormData,
  type UnitItemFormInput,
} from "@/validation/unitItemSchema";
import HookFormTextArea from "../forms/HookFormTextArea";
import HookFormSelect from "../forms/HookFormSelect";
import { useCreateUnitItem } from "@/hooks/unit_items/useCreateUnitItem";
import { useUpdateUnitItem } from "@/hooks/unit_items/useUpdateUnitItem";

interface UnitItemFormModalProps {
  onClose: () => void;
  initialValues: (UnitItemFormData & { id: number }) | null;
  unit_id: string;
}

const unitItemTypeOptions = [
  {
    value: "lesson",
    label: "درس",
  },
  {
    value: "video",
    label: "فيديو",
  },
  {
    value: "exam",
    label: "امتحان",
  },
];

const UnitItemFormModal = ({
  onClose,
  initialValues,
  unit_id,
}: UnitItemFormModalProps) => {
  const createMutation = useCreateUnitItem();
  const updateMutation = useUpdateUnitItem();

  const form = useForm<UnitItemFormInput>({
    resolver: zodResolver(unitItemSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      type: "lesson",
      content: "",
      unit_id,
    },
  });

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: UnitItemFormData) => {
    if (initialValues) {
      await updateMutation.mutateAsync({ ...data, id: initialValues.id });
    } else {
      await createMutation.mutateAsync(data);
    }
    onCloseHandler();
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        title: initialValues.title,
        type: initialValues.type,
        content: initialValues.content,
        unit_id: initialValues.unit_id,
      });
    } else {
      form.reset({
        title: "",
        type: "lesson",
        content: "",
        unit_id,
      });
    }
  }, [initialValues, form, unit_id]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmitHandler as unknown as SubmitHandler<UnitItemFormInput>,
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="اسم الدرس"
              name="title"
              placeholder="ادخل اسم الدرس"
              required
            />
            <HookFormSelect
              label="نوع الدرس"
              name="type"
              options={unitItemTypeOptions}
              placeholder="ادخل نوع الدرس"
              required
            />
            <HookFormTextArea
              label="محتوى الدرس"
              name="content"
              placeholder="ادخل محتوى الدرس..."
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

export default UnitItemFormModal;
