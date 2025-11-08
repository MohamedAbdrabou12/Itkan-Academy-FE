import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type { FormField, FormComponents } from "@/types/Forms";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import { FormProvider, useForm, type FieldValues } from "react-hook-form";
import { z } from "zod";

// Constrain T to be a Zod schema that outputs FieldValues
interface GenericFormModalProps<T extends z.ZodType<FieldValues>> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  initialData?: z.infer<T>;
  isSubmitting?: boolean;
  isEditing?: boolean;
  closeOnBackdropClick?: boolean;
  schema: T;
  fields: FormField[];
  title: string;
  description: string;
  submitButtonText: string;
  editingSubmitButtonText: string;
  formComponents: FormComponents;
}

export const GenericFormModal = <T extends z.ZodType<FieldValues>>({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  isEditing = false,
  closeOnBackdropClick = true,
  schema,
  fields,
  title,
  description,
  submitButtonText,
  editingSubmitButtonText,
  formComponents,
}: GenericFormModalProps<T>) => {
  const ModalRef = useRef<HTMLDivElement>(null);

  type FormData = z.infer<T>;

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: initialData,
  });

  const enabled = isOpen && closeOnBackdropClick;

  const {
    handleSubmit,
    reset,
    formState: { isDirty },
  } = methods;

  const handleClose = () => {
    reset();
    onClose();
  };

  useClickOutsideModal(ModalRef, handleClose, enabled);

  const onFormSubmit = async (data: FormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      reset(initialData || ({} as FormData));
    }
  }, [isOpen, initialData, reset]);

  const renderFormField = (field: FormField) => {
    const { Input, TextArea, Select } = formComponents;

    switch (field.type) {
      case "textarea":
        return (
          <TextArea
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            placeholder={field.placeholder}
            rows={field.rows}
          />
        );
      case "select":
        return (
          <Select
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            options={field.options || []}
          />
        );
      default:
        return (
          <Input
            key={field.name}
            name={field.name}
            label={field.label}
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            dir={field.dir}
          />
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        {/* Modal */}
        <div
          ref={ModalRef}
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-right text-lg font-semibold leading-6 text-gray-900">
                  {title}
                </h3>
                <p className="mt-1 text-right text-sm text-gray-500">
                  {description}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">{fields.map(renderFormField)}</div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end gap-3 space-x-3 space-x-reverse">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      جاري الحفظ...
                    </span>
                  ) : isEditing ? (
                    editingSubmitButtonText
                  ) : (
                    submitButtonText
                  )}
                </button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
};
