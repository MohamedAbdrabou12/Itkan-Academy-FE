import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import HookFormInput from "../forms/HookFormInput";
import { Modal } from "../shared/Modal";
import {
  subjectSchema,
  type SubjectFormData,
  type SubjectFormInput,
} from "@/validation/subjectSchema";
import { useCreateSubject } from "@/hooks/subjects/useCreateSubject";
import { useUpdateSubject } from "@/hooks/subjects/useUpdateSubject";

interface SubjectFormModalProps {
  onClose: () => void;
  initialValues: (SubjectFormData & { id: number }) | null;
}

const SubjectFormModal = ({
  onClose,
  initialValues,
}: SubjectFormModalProps) => {
  const createMutation = useCreateSubject();
  const updateMutation = useUpdateSubject();

  const form = useForm<SubjectFormInput>({
    resolver: zodResolver(subjectSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    },
  });

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: SubjectFormData) => {
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
      });
    } else {
      form.reset({
        name: "",
      });
    }
  }, [initialValues, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmitHandler as unknown as SubmitHandler<SubjectFormInput>,
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            <HookFormInput
              label="اسم المادة"
              name="name"
              placeholder="ادخل اسم المادة"
              required
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

export default SubjectFormModal;
