import { FormInput } from "@/components/forms/FormInput";
import { FormSelect } from "@/components/forms/FormSelect";
import { FormTextArea } from "@/components/forms/FormTextArea";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import { branchSchema, type BranchFormData } from "@/validation/branchSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: BranchFormData;
  isSubmitting?: boolean;
  isEditing?: boolean;
  closeOnBackdropClick?: boolean;
}

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "deactive", label: "Deactive" },
];

export const BranchFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  isEditing = false,
  closeOnBackdropClick = true,
}: BranchFormModalProps) => {
  const ModalRef = useRef<HTMLDivElement>(null);
  const methods = useForm<BranchFormData>({
    resolver: zodResolver(branchSchema),
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

  const onFormSubmit = async (data: BranchFormData) => {
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
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
              {/* Header */}
              <div>
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                  {isEditing ? "Edit Branch" : "Add New Branch"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {isEditing
                    ? "Update the branch details below."
                    : "Fill in the details to create a new branch."}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <FormInput
                  name="name"
                  label="Branch Name"
                  required
                  placeholder="Enter branch name"
                  value={initialData?.name}
                />

                <FormInput
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Enter branch email"
                  value={initialData?.email}
                />

                <FormInput
                  name="phone"
                  label="Phone"
                  placeholder="Enter branch phone number"
                  value={initialData?.phone}
                />

                <FormTextArea
                  name="address"
                  label="Address"
                  placeholder="Enter branch address..."
                  rows={3}
                  value={initialData?.address}
                />

                <FormSelect
                  name="status"
                  label="Status"
                  options={statusOptions}
                  required
                  placeholder="Select status"
                  value={initialData?.status}
                />
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  ) : isEditing ? (
                    "Update Branch"
                  ) : (
                    "Create Branch"
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
