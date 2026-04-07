import type { PERMISSION_VALUE } from "@/types/permissions";
import { Plus } from "lucide-react";
import type { ReactNode } from "react";
import PermissionGate from "../auth/PermissionGate";

interface GridHeaderProps {
  title: string;
  extraInfo?: ReactNode;
  onAddNew?: () => void;
  addButtonText: string;
  addButtonIcon?: ReactNode;
  addPermission?: PERMISSION_VALUE;
}

const GridHeader = ({
  title,
  extraInfo,
  onAddNew,
  addButtonText,
  addButtonIcon,
  addPermission,
}: GridHeaderProps) => (
  <div className="border-b border-gray-200 bg-white px-6 py-5 shadow-sm">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>

      {(onAddNew || extraInfo) && (
        <div className="flex items-center gap-2">
          {extraInfo &&
            (typeof extraInfo == "string" ? (
              <p className="text-lg text-gray-600">{extraInfo}</p>
            ) : (
              extraInfo
            ))}

          {onAddNew && (
            <PermissionGate permissions={addPermission ? [addPermission] : []}>
              <button onClick={onAddNew} className="btn-primary">
                {addButtonIcon || <Plus className="h-4 w-4" />}
                <span>{addButtonText}</span>
              </button>
            </PermissionGate>
          )}
        </div>
      )}
    </div>
  </div>
);

export default GridHeader;
