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

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  itemName,
  isDeleting = false,
}: DeleteConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500/75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
          <div className="flex items-center gap-3">
            <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <TriangleAlert color="red" size={25} />
            </div>

            <h3 className="text-lg font-semibold leading-6 text-gray-900">
              {title}
            </h3>
          </div>

          <div className="mt-5 text-right sm:mr-4">
            <p className="text-sm text-gray-500">{description}</p>
            {itemName && (
              <p className="mt-2 text-sm font-medium text-red-600">
                "{itemName}"
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:mt-0 sm:w-auto"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              {isDeleting ? (
                <span className="flex items-center">
                  <svg
                    className="ml-2 h-4 w-4 animate-spin"
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
                  جاري الحذف...
                </span>
              ) : (
                "حذف"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
