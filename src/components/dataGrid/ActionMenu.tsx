import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type { ActionMenuProps } from "@/types/dataGrid";
// import PermissionGate from "../auth/PermissionGate";
import { EllipsisVertical, Eye, Pencil, Trash } from "lucide-react";
import { useRef, useState } from "react";

const ActionMenu = <T extends Record<string, unknown>>({
  item,
  onEdit,
  onDelete,
  onView,
  // permission,
}: ActionMenuProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const actions = [
    ...(onView
      ? [{ label: "رؤية", action: onView, icon: <Eye size={20} /> }]
      : []),
    ...(onEdit
      ? [{ label: "تعديل", action: onEdit, icon: <Pencil size={20} /> }]
      : []),
    ...(onDelete
      ? [
          {
            label: "الغاء",
            action: onDelete,
            icon: <Trash size={20} />,
            destructive: true,
          },
        ]
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
        <EllipsisVertical />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-gray-50 shadow-lg">
          <div className="py-1">
            {/* <PermissionGate
              permission={permission}
              fallback={
                <div className="cursor-not-allowed px-4 py-2 text-center text-sm text-gray-500">
                  لا تمتلك الصلاحيات للاجراءات
                </div>
              }
            > */}
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
            {/* </PermissionGate> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
