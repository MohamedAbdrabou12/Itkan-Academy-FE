import type { PERMISSION_VALUE } from "@/types/permissions";
import { Plus } from "lucide-react";
import PermissionGate from "../auth/PermissionGate";

interface GridHeaderProps {
  title: string;
  onAddNew?: () => void;
  addButtonText: string;
  addPermission?: PERMISSION_VALUE;
}

const GridHeader = ({
  title,
  onAddNew,
  addButtonText,
  addPermission,
}: GridHeaderProps) => (
  <div className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>

      {onAddNew && (
        <PermissionGate permissions={addPermission ? [addPermission] : []}>
          <button
            onClick={onAddNew}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>{addButtonText}</span>
          </button>
        </PermissionGate>
      )}
    </div>
  </div>
);

export default GridHeader;