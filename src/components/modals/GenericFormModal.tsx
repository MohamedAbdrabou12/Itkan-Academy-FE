import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type { FormField, FormComponents } from "@/types/Forms";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

interface GenericFormModalProps<T extends z.ZodType> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<T>) => Promise<void>;
  initialData?: Partial<z.infer<T>>;
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

export const GenericFormModal = <T extends z.ZodType>({
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

  // Form state management
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const enabled = isOpen && closeOnBackdropClick;

  const handleClose = () => {
    setFormData({});
    setErrors({});
    setTouched({});
    onClose();
  };

  useClickOutsideModal(ModalRef, handleClose, enabled);

  // Handle input changes
  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  // Validate form
  const validateForm = (): boolean => {
    try {
      // Create a complete form data object with empty strings for missing fields
      const completeFormData: Record<string, unknown> = {};
      fields.forEach((field) => {
        completeFormData[field.name] =
          formData[field.name as keyof FormData] || "";
      });

      schema.parse(completeFormData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched on submit
    const allTouched: Record<string, boolean> = {};
    fields.forEach((field) => {
      allTouched[field.name] = true;
    });
    setTouched(allTouched);

    const isValid = validateForm();

    if (isValid) {
      console.log("Submitting form data:", formData);
      try {
        // Create complete data for submission
        const submissionData: Record<string, unknown> = {};
        fields.forEach((field) => {
          submissionData[field.name] =
            formData[field.name as keyof FormData] || "";
        });

        await onSubmit(submissionData as z.infer<T>);
        handleClose();
      } catch (error) {
        // Handle submission error (keep form open)
        console.error("Submission error:", error);
      }
    }
  };

  // Validate field on blur
  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Validate single field using the full schema but only checking this field
    try {
      const fieldSchema = schema.shape[fieldName as keyof typeof schema.shape];
      if (fieldSchema) {
        fieldSchema.parse(formData[fieldName as keyof FormData] || "");
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "",
        }));
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors[0];
        if (fieldError) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: fieldError.message,
          }));
        }
      }
    }
  };

  // Initialize form data when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      // Create default data based on fields
      const defaultData: Partial<FormData> = {};
      fields.forEach((field) => {
        const initialValue = initialData?.[field.name as keyof FormData];
        defaultData[field.name as keyof FormData] =
          initialValue !== undefined ? initialValue : "";
      });

      console.log("Initializing form with:", defaultData);
      setFormData(defaultData);
      setErrors({});
      setTouched({});
    }
  }, [isOpen, initialData, fields]);

  // Check form validity for submit button
  const isFormValid = (): boolean => {
    try {
      // Create complete data for validation
      const completeFormData: Record<string, unknown> = {};
      fields.forEach((field) => {
        completeFormData[field.name] =
          formData[field.name as keyof FormData] || "";
      });

      schema.parse(completeFormData);
      return true;
    } catch {
      return false;
    }
  };

  // Check if form is dirty
  const isFormDirty = (): boolean => {
    if (!initialData || Object.keys(initialData).length === 0) {
      // For new forms, check if any required field has a value
      // OR check if any field has been modified from its initial empty state
      const hasAnyValue = Object.values(formData).some(
        (value) => value !== undefined && value !== null && value !== "",
      );

      // Also consider the form dirty if user has started typing in any field
      const hasTouchedFields = Object.keys(touched).length > 0;

      return hasAnyValue || hasTouchedFields;
    }

    // For editing, compare current form data with initial data
    return fields.some((field) => {
      const fieldName = field.name as keyof FormData;
      const currentValue = formData[fieldName];
      const initialValue = initialData[fieldName];
      return currentValue !== initialValue;
    });
  };

  const renderFormField = (field: FormField) => {
    const { Input, TextArea, Select } = formComponents;
    const value = formData[field.name as keyof FormData] || "";
    const error = errors[field.name];
    const isFieldTouched = touched[field.name];

    const commonProps = {
      name: field.name,
      label: field.label,
      required: field.required,
      value: value as string,
      onChange: (value: string) => handleInputChange(field.name, value),
      onBlur: () => handleFieldBlur(field.name),
      error: isFieldTouched ? error : undefined,
      placeholder: field.placeholder,
      dir: field.dir,
      disabled: field.disabled,
    };

    switch (field.type) {
      case "textarea":
        return <TextArea key={field.name} {...commonProps} rows={field.rows} />;
      case "select":
        return (
          <Select
            key={field.name}
            {...commonProps}
            options={field.options || []}
          />
        );
      default:
        return <Input key={field.name} {...commonProps} type={field.type} />;
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
          <form onSubmit={handleFormSubmit} className="space-y-6">
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
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !isFormValid() || !isFormDirty()}
                className="rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
};
