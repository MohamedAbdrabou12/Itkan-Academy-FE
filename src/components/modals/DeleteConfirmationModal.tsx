import React from "react";
import { TriangleAlert } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  itemName?: string;
  isDeleting?: boolean;
}

export const DeleteConfirmationModal: React.FC<
  DeleteConfirmationModalProps
> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-50/75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="flex items-center gap-3">
            <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <TriangleAlert color="red" size={25} />
            </div>

            <h3 className="text-lg leading-6 font-semibold text-gray-900">
              {title}
            </h3>
          </div>

          {/* Content */}
          <div className="mt-5 text-center sm:ml-4 sm:text-left">
            <p className="text-sm text-gray-500">{description}</p>
            {itemName && (
              <p className="mt-2 text-sm font-medium text-red-600">
                "{itemName}"
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto"
            >
              {isDeleting ? (
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
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 sm:mt-0 sm:w-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
