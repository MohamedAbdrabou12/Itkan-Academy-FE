import PermissionGate from "@/components/auth/PermissionGate";
import ActionMenu from "@/components/dataGrid/ActionMenu";
import EmptyState from "@/components/dataGrid/EmptyState";
import GridError from "@/components/dataGrid/GridError";
import UnitFormModal from "@/components/modals/UnitFormModal";
import UnitItemFormModal from "@/components/modals/UnitItemFormModal";
import Spinner from "@/components/shared/Spinner";
import { PermissionKeys } from "@/constants/permissions";
import { useGetSubject } from "@/hooks/subjects/useGetSubject";
import {
  UnitItemType,
  type DetailedUnit,
  type Unit,
  type UnitItem,
} from "@/types/educationalContent";
import clsx from "clsx";
import { ArrowRight, ChevronDown, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

const SubjectContentPage = () => {
  const { id } = useParams<{ id: string }>();
  const { subject, isPending, error } = useGetSubject(id);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [unitBeingEdited, setUnitBeingEdited] = useState<Unit | null>(null);
  const navigate = useNavigate();

  const onAddNewUnit = () => {
    setUnitBeingEdited(null);
    setIsFormModalOpen(true);
  };

  const onUnitEdit = (unit: Unit) => {
    setUnitBeingEdited(unit);
    setIsFormModalOpen(true);
  };

  return (
    <div className="mx-24 my-16 rounded-lg border-2 border-gray-200 bg-white px-4 py-4">
      <div className="rounded-lg border-2 border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            إدارة المنهج التعليمى
          </h1>

          <PermissionGate
            permissions={[PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_ADD]}
          >
            <button onClick={onAddNewUnit} className="btn-primary">
              <Plus className="h-4 w-4" />
              <span>إضافة وحدة دراسية</span>
            </button>
          </PermissionGate>
        </div>
      </div>

      <PermissionGate
        permissions={[PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_VIEW]}
      >
        {isPending && <Spinner />}
        {error && <GridError message={error.message} />}
        {!isPending && !error && !subject && (
          <EmptyState hasFilters={false} entityName="مادة دراسية" />
        )}

        {!isPending && !error && subject && (
          <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 px-6 py-2">
            <h1 className="text-2xl font-semibold">
              وحدات مادة {subject.name}
            </h1>
            {subject.units.map((unit) => (
              <UnitComponent
                key={unit.id}
                unit={unit}
                onUnitEdit={onUnitEdit}
              />
            ))}
          </div>
        )}
      </PermissionGate>

      {isFormModalOpen && subject && (
        <UnitFormModal
          onClose={() => setIsFormModalOpen(false)}
          initialValues={
            unitBeingEdited
              ? {
                  id: unitBeingEdited.id,
                  title: unitBeingEdited.title,
                  description: unitBeingEdited.description,
                  curriculum_id: unitBeingEdited.curriculum_id.toString(),
                  subject_id: subject.id.toString(),
                }
              : null
          }
          subject_id={subject.id.toString()}
        />
      )}

      <button onClick={() => navigate(-1)} className="btn-primary mt-4">
        <ArrowRight className="h-4 w-4" /> الرجوع
      </button>
    </div>
  );
};

interface UnitComponentProps {
  unit: DetailedUnit;
  onUnitEdit: (unit: DetailedUnit) => void;
}

const UnitComponent = ({ unit, onUnitEdit }: UnitComponentProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [unitItemBeingEdited, setUnitItemBeingEdited] =
    useState<UnitItem | null>(null);

  const onAddNewUnitItem = () => {
    setUnitItemBeingEdited(null);
    setIsFormModalOpen(true);
  };

  const onEditUnitItem = (item: UnitItem) => {
    setUnitItemBeingEdited(item);
    setIsFormModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col">
        <div
          onClick={() => setIsDropdownOpen((open) => !open)}
          className={clsx(
            "flex cursor-pointer items-center border-2 border-gray-200 px-6 py-2 transition-colors duration-150",
            isDropdownOpen
              ? "rounded-t-lg bg-emerald-400/20"
              : "rounded-lg hover:bg-emerald-300/20",
          )}
        >
          <div className="flex flex-1 flex-col">
            <div className="flex items-center gap-2">
              <ChevronDown
                className={clsx(
                  "transition-transform",
                  isDropdownOpen ? "rotate-0" : "rotate-90",
                )}
              />
              <div className="text-xl">{unit.title}</div>
              <div className="flex items-center rounded-xl border-2 border-transparent bg-emerald-400/30 px-2 py-0.5 text-sm">
                {unit.curriculum_name}
              </div>
            </div>
            <div className="text-gray-500">{unit.description}</div>
          </div>
          <div
            className="flex items-center gap-2"
            onClick={(event) => event.stopPropagation()}
          >
            <button onClick={onAddNewUnitItem} className="btn-primary">
              <Plus className="h-4 w-4" />
              <span>إضافة درس</span>
            </button>

            <ActionMenu
              item={unit}
              checkReservedRoles={false}
              editPermission={PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_EDIT}
              onEdit={onUnitEdit}
            />
          </div>
        </div>
        {isDropdownOpen && (
          <div className="rounded-b-lg border-x-2 border-b-2 border-gray-200">
            {unit.items.map((item) => (
              <div className="not-last:border-b-2 flex items-center border-gray-200 px-6 py-2">
                <div className="flex flex-1 flex-col">
                  <div className="flex gap-2">
                    <div className="text-lg">{item.title}</div>
                    <div className="flex items-center rounded-xl border-2 border-transparent bg-emerald-400/30 px-2 py-0.5 text-xs">
                      {item.type === UnitItemType.LESSON
                        ? "درس"
                        : item.type === UnitItemType.VIDEO
                          ? "فيديو"
                          : "امتحان"}
                    </div>
                  </div>
                  {item.type === UnitItemType.VIDEO ? (
                    <a href={item.content} className="text-emerald-500/80">
                      رابط الفيديو
                    </a>
                  ) : (
                    <div className="text-gray-500">{item.content}</div>
                  )}
                </div>
                <ActionMenu
                  item={item}
                  checkReservedRoles={false}
                  editPermission={
                    PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_EDIT
                  }
                  onEdit={onEditUnitItem}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {isFormModalOpen && (
        <UnitItemFormModal
          onClose={() => setIsFormModalOpen(false)}
          initialValues={
            unitItemBeingEdited
              ? {
                  id: unitItemBeingEdited.id,
                  title: unitItemBeingEdited.title,
                  type: unitItemBeingEdited.type,
                  content: unitItemBeingEdited.content,
                  unit_id: unitItemBeingEdited.unit_id.toString(),
                }
              : null
          }
          unit_id={unit.id.toString()}
        />
      )}
    </>
  );
};

export default SubjectContentPage;
