import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import { useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  children: ReactNode;
}

export const Modal = ({
  isOpen,
  onClose,
  closeOnBackdropClick = true,
  children,
}: ModalProps) => {
  const ModalRef = useRef<HTMLDivElement>(null);

  const enabled = isOpen && closeOnBackdropClick;

  const handleClose = () => {
    onClose();
  };

  useClickOutsideModal(ModalRef, handleClose, enabled);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        {/* Modal */}
        <div
          ref={ModalRef}
          className="relative transform rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
        >
          {children}
        </div>
      </div>
    </div>
  );
};
