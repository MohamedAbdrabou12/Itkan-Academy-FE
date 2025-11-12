import { usePermissionMatrix } from "@/hooks/permissions/usePermissionMatrix";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type { RoleDetails } from "@/types/Roles";
import { translateToArabic } from "@/utils/permissionTranslations";
import { useRef, useState } from "react";

interface RolePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: RoleDetails;
  onPermissionsUpdated?: () => void;
}

const RolePermissionsModal = ({
  isOpen,
  onClose,
  role,
  onPermissionsUpdated,
}: RolePermissionsModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const {
    permissionMatrix,
    categories,
    modules,
    actions,
    availablePermissions,
    assignedPermissionIds,
    isLoading,
    isUpdating,
    hasUnsavedChanges,
    togglePermission,
    toggleModulePermissions,
    toggleAllPermissions,
    savePermissions,
    resetPermissions,
    error,
  } = usePermissionMatrix(role.id);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [tooltip, setTooltip] = useState({
    show: false,
    content: "",
    x: 0,
    y: 0,
  });

  const handleClose = () => {
    if (hasUnsavedChanges && !showConfirmation) {
      setShowConfirmation(true);
      return;
    }
    setShowConfirmation(false);
    onClose();
  };

  useClickOutsideModal(modalRef, handleClose, isOpen);

  const handleSave = async () => {
    const success = await savePermissions();
    if (success) {
      onPermissionsUpdated?.();
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowConfirmation(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowConfirmation(false);
  };

  // Show tooltip on hover
  const handleMouseEnter = (
    event: React.MouseEvent<HTMLInputElement>,
    moduleKey: string,
    action: string,
  ) => {
    const permissionData = permissionMatrix[moduleKey]?.[action];
    if (permissionData?.permission.description_ar) {
      const rect = event.currentTarget.getBoundingClientRect();
      setTooltip({
        show: true,
        content: permissionData.permission.description_ar,
        x: rect.left,
        y: rect.top, // Position above the checkbox
      });
    }
  };

  // Hide tooltip
  const handleMouseLeave = () => {
    setTooltip({ show: false, content: "", x: 0, y: 0 });
  };

  // Get all unique actions across all modules
  const getAllActions = (): string[] => {
    const allActions = new Set<string>();
    Object.values(actions).forEach((moduleActions) => {
      moduleActions.forEach((action) => allActions.add(action));
    });
    return Array.from(allActions).sort();
  };

  const isModuleFullyGranted = (moduleKey: string): boolean => {
    const moduleActions = actions[moduleKey] || [];
    return moduleActions.every(
      (action) => permissionMatrix[moduleKey]?.[action]?.granted,
    );
  };

  const isModulePartiallyGranted = (moduleKey: string): boolean => {
    const moduleActions = actions[moduleKey] || [];
    const grantedCount = moduleActions.filter(
      (action) => permissionMatrix[moduleKey]?.[action]?.granted,
    ).length;
    return grantedCount > 0 && grantedCount < moduleActions.length;
  };

  const getPermissionByCode = (
    moduleKey: string,
    action: string,
  ): { permissionId: number; granted: boolean; description_ar?: string } => {
    const permissionData = permissionMatrix[moduleKey]?.[action];
    return {
      permissionId: permissionData?.permission.id || 0,
      granted: permissionData?.granted || false,
      description_ar: permissionData?.permission.description_ar,
    };
  };

  const allActions = getAllActions();
  const totalPermissions = availablePermissions.length;
  const grantedPermissions = assignedPermissionIds.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-7xl sm:p-6"
        >
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-right text-lg font-semibold leading-6 text-gray-900">
                  إدارة صلاحيات الوظيفة: {role.name_ar}
                </h3>
                <p className="mt-1 text-right text-sm text-gray-500">
                  قم بتحديد الصلاحيات المسموحة لهذه الوظيفة
                </p>
              </div>
              <div className="text-left text-sm text-gray-500">
                <div>
                  {grantedPermissions} / {totalPermissions} صلاحية
                </div>
                {hasUnsavedChanges && (
                  <div className="text-orange-600">
                    ⚠️ لديك تغييرات غير محفوظة
                  </div>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error.message}</div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <>
              {/* Global Actions */}
              <div className="mb-4 flex justify-between rounded-md bg-gray-50 p-3">
                <div className="text-sm text-gray-600">
                  الصلاحيات الممنوحة:{" "}
                  <span className="font-semibold">{grantedPermissions}</span> من{" "}
                  <span className="font-semibold">{totalPermissions}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => toggleAllPermissions(true)}
                    className="cursor-pointer rounded-md bg-green-100 px-3 py-1 text-sm font-medium text-green-800 hover:bg-green-200"
                  >
                    منح الكل
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleAllPermissions(false)}
                    className="cursor-pointer rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-800 hover:bg-red-200"
                  >
                    إزالة الكل
                  </button>
                </div>
              </div>

              {/* Permission Matrix */}
              <div className="max-h-96 overflow-auto rounded-lg border">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        القسم / الوحدة
                      </th>
                      <th className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        اختيار الكل
                      </th>
                      {allActions.map((action) => (
                        <th
                          key={action}
                          className="sticky top-0 z-10 bg-gray-50 px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                        >
                          {translateToArabic(action)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {categories.map((category) =>
                      modules[category]?.map((module) => {
                        const moduleKey = `${category}.${module}`;
                        const moduleActions = actions[moduleKey] || [];
                        const isFullyGranted = isModuleFullyGranted(moduleKey);
                        const isPartiallyGranted =
                          isModulePartiallyGranted(moduleKey);

                        return (
                          <tr
                            key={moduleKey}
                            className="transition-colors hover:bg-gray-50"
                          >
                            <td className="whitespace-nowrap px-6 py-4">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  {translateToArabic(module)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {translateToArabic(category)}
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                              <input
                                type="checkbox"
                                checked={isFullyGranted}
                                ref={(el) => {
                                  if (el) {
                                    el.indeterminate = isPartiallyGranted;
                                  }
                                }}
                                onChange={(e) =>
                                  toggleModulePermissions(
                                    moduleKey,
                                    e.target.checked,
                                  )
                                }
                                onMouseEnter={(e) => {
                                  const firstPermission =
                                    availablePermissions.find((p) =>
                                      p.code.startsWith(`${moduleKey}.`),
                                    );
                                  if (firstPermission?.description_ar) {
                                    const rect =
                                      e.currentTarget.getBoundingClientRect();
                                    setTooltip({
                                      show: true,
                                      content: firstPermission.description_ar,
                                      x: rect.left,
                                      y: rect.top,
                                    });
                                  }
                                }}
                                onMouseLeave={handleMouseLeave}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            {allActions.map((action) => {
                              const { permissionId, granted } =
                                getPermissionByCode(moduleKey, action);
                              const hasAction = moduleActions.includes(action);

                              return (
                                <td
                                  key={action}
                                  className="whitespace-nowrap px-6 py-4 text-center"
                                >
                                  {hasAction ? (
                                    <div className="relative inline-block">
                                      <input
                                        type="checkbox"
                                        checked={granted}
                                        onChange={(e) =>
                                          togglePermission(
                                            permissionId,
                                            e.target.checked,
                                          )
                                        }
                                        onMouseEnter={(e) =>
                                          handleMouseEnter(e, moduleKey, action)
                                        }
                                        onMouseLeave={handleMouseLeave}
                                        className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        disabled={isUpdating}
                                      />
                                    </div>
                                  ) : (
                                    <span className="cursor-default text-lg text-gray-300">
                                      —
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      }),
                    )}
                  </tbody>
                </table>
              </div>

              {/* Tooltip */}
              {tooltip.show && (
                <div
                  className="z-100 fixed max-w-xs rounded-md bg-gray-900/50 px-3 py-2 text-sm text-white shadow-lg"
                  style={{
                    left: tooltip.x,
                    top: tooltip.y - 10,
                    transform: "translateY(-100%) translateX(-50%)",
                  }}
                >
                  {tooltip.content}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={resetPermissions}
                    disabled={!hasUnsavedChanges || isUpdating}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    إعادة تعيين
                  </button>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isUpdating}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isUpdating || !hasUnsavedChanges}
                    className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUpdating ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        جاري الحفظ...
                      </span>
                    ) : (
                      "حفظ الصلاحيات"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Unsaved Changes Confirmation */}
          {showConfirmation && (
            <div className="z-60 fixed inset-0 flex items-center justify-center">
              {/* Backdrop - darker to distinguish from parent modal backdrop */}
              <div className="fixed inset-0 bg-black/70" />

              {/* Confirmation Modal */}
              <div className="relative mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                <h3 className="text-lg font-semibold text-gray-900">
                  تأكيد الإغلاق
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  لديك تغييرات غير محفوظة. هل تريد المتابعة دون حفظ؟
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    onClick={handleCancelClose}
                    className="cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    البقاء
                  </button>
                  <button
                    onClick={handleConfirmClose}
                    className="cursor-pointer rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    مغادرة دون حفظ
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsModal;
