import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type { ActionMenuProps } from "@/types/dataGrid";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react";
import { useRef, useState } from "react";
import PermissionGate from "../auth/PermissionGate";

const ActionMenu = <T extends Record<string, unknown>>({
  item,
  onEdit,
  onDelete,
  onView,
  editPermission,
  deletePermission,
}: ActionMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const actions = [
    ...(onView
      ? [
          {
            label: "عرض",
            action: onView,
            icon: <Eye size={18} />,
            type: "view",
          },
        ]
      : []),
    ...(onEdit
      ? [
          {
            label: "تعديل",
            action: onEdit,
            icon: <Pencil size={18} />,
            type: "edit",
          },
        ]
      : []),
    ...(onDelete
      ? [
          {
            label: "حذف",
            action: onDelete,
            icon: <Trash size={18} />,
            type: "delete",
          },
        ]
      : []),
  ];

  useClickOutsideModal(menuRef, () => setIsOpen(false));

  if (!actions.length) return null;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Actions"
        className="rounded-xl p-2 transition-all hover:bg-emerald-50 hover:text-emerald-600"
      >
        <EllipsisVertical className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200
                     bg-white shadow-xl ring-1 ring-gray-100 animate-fadeIn"
        >
          <div className="py-1">
            {actions.map((action, index) => {
              const permission =
                action.type === "delete"
                  ? deletePermission ?? ""
                  : editPermission ?? "";

              const baseClasses =
                "flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors";

              const viewClasses = "text-gray-700 hover:bg-gray-100";
              const editClasses = "text-emerald-600 hover:bg-emerald-50";
              const deleteClasses = "text-red-600 hover:bg-red-50";

              const variantClasses =
                action.type === "view"
                  ? viewClasses
                  : action.type === "edit"
                  ? editClasses
                  : deleteClasses;

              return (
                <PermissionGate key={index} permission={permission}>
                  <button
                    onClick={() => {
                      action.action(item);
                      setIsOpen(false);
                    }}
                    className={`${baseClasses} ${variantClasses}`}
                  >
                    {action.icon}
                    <span>{action.label}</span>
                  </button>
                </PermissionGate>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;