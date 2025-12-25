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
          <button onClick={onAddNew} className="btn-primary">
            <Plus className="h-4 w-4" />
            <span>{addButtonText}</span>
          </button>
        </PermissionGate>
      )}
    </div>
  </div>
);

export default GridHeader;
