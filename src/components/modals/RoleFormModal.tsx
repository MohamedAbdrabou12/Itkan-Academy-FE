import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextArea } from "@/components/forms/FormTextArea";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import { UserRole } from "@/types/Roles";
import { roleSchema, type RoleFormData } from "@/validation/roleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
  initialData?: RoleFormData;
  isSubmitting?: boolean;
  isEditing?: boolean;
  closeOnBackdropClick?: boolean;
}

const roleOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: role,
}));

export const RoleFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  isEditing = false,
  closeOnBackdropClick = true,
}: RoleFormModalProps) => {
  const ModalRef = useRef<HTMLDivElement>(null);
  const methods = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
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

  /* Hook for click outside modal and escape button */
  useClickOutsideModal(ModalRef, handleClose, enabled);

  const onFormSubmit = async (data: RoleFormData) => {
    await onSubmit(data);
    reset();
    onClose();
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
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg leading-6 font-semibold text-gray-900">
                  {initialData ? "Edit Role" : "Add New Role"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {initialData
                    ? "Update the role details below."
                    : "Fill in the details to create a new role."}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <FormSelect
                  name="name"
                  label="Role Name"
                  options={roleOptions}
                  required
                  placeholder="Select a role"
                  disabled={isEditing}
                  value={initialData?.name}
                />

                <FormTextArea
                  name="description"
                  label="Description"
                  required
                  placeholder="Enter role description..."
                  rows={3}
                  value={initialData?.description}
                />

                <FormInput
                  name="name_in_arabic"
                  label="Name in Arabic"
                  required
                  placeholder="أدخل الاسم بالعربية"
                  value={initialData?.name_in_arabic}
                />
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                      >
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
                      Saving...
                    </span>
                  ) : initialData ? (
                    "Update Role"
                  ) : (
                    "Create Role"
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
