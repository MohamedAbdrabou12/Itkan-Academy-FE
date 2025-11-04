import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type { ActionMenuProps } from "@/types/dataGrid";
import { useState, useRef } from "react";

const ActionMenu = ({
  item,
  onEdit,
  onDelete,
  onView,
}: ActionMenuProps<Record<string, unknown>>) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const actions = [
    ...(onView ? [{ label: "View", action: onView, icon: "👁️" }] : []),
    ...(onEdit ? [{ label: "Edit", action: onEdit, icon: "✏️" }] : []),
    ...(onDelete
      ? [{ label: "Delete", action: onDelete, icon: "🗑️", destructive: true }]
      : []),
  ];

  /* Hook to detect click outside menu or escape key */
  useClickOutsideModal(menuRef, () => setIsOpen(false));

  if (actions.length === 0) return null;

  return (
    <div ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg p-2 transition-colors hover:bg-gray-100"
        aria-label="Actions"
      >
        <svg
          className="h-5 w-5 text-gray-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="py-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  action.action(item);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center space-x-2 px-4 py-2 text-left text-sm transition-colors ${
                  action.destructive
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span>{action.icon}</span>
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
