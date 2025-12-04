import type { PermissionKeys } from "@/constants/permissions";
import { Plus } from "lucide-react";
import PermissionGate from "../auth/PermissionGate";

interface GridHeaderProps {
  title: string;
  onAddNew?: () => void;
  addButtonText: string;
  addPermission?: (typeof PermissionKeys)[keyof typeof PermissionKeys];
}

const GridHeader = ({
  title,
  onAddNew,
  addButtonText,
  addPermission,
}: GridHeaderProps) => (
  <div className="border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {onAddNew && (
        <PermissionGate permission={addPermission || ""}>
          <button
            onClick={onAddNew}
            className="flex cursor-pointer items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
          >
            <span>
              <Plus />
            </span>
            <span>{addButtonText}</span>
          </button>
        </PermissionGate>
      )}
    </div>
  </div>
);

export default GridHeader;
