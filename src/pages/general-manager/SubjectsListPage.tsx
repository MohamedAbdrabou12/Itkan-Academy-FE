import PermissionGate from "@/components/auth/PermissionGate";
import ActionMenu from "@/components/dataGrid/ActionMenu";
import EmptyState from "@/components/dataGrid/EmptyState";
import GridError from "@/components/dataGrid/GridError";
import SubjectFormModal from "@/components/modals/SubjectFormModal";
import Spinner from "@/components/shared/Spinner";
import { PermissionKeys } from "@/constants/permissions";
import { useGetAllSubjects } from "@/hooks/subjects/useGetAllSubjects";
import type { Subject } from "@/types/educationalContent";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const SubjectsListPage = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [subjectBeingEdited, setSubjectBeingEdited] = useState<Subject | null>(
    null,
  );

  const onAddNew = () => {
    setSubjectBeingEdited(null);
    setIsFormModalOpen(true);
  };

  const onEdit = (subject: Subject) => {
    setSubjectBeingEdited(subject);
    setIsFormModalOpen(true);
  };

  const { subjects, isPending, error } = useGetAllSubjects();

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
            <button onClick={onAddNew} className="btn-primary">
              <Plus className="h-4 w-4" />
              <span>إضافة مادة دراسية</span>
            </button>
          </PermissionGate>
        </div>
      </div>

      <PermissionGate
        permissions={[PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_VIEW]}
      >
        {isPending && <Spinner />}
        {error && <GridError message={error.message} />}
        {!isPending && !error && subjects?.length === 0 && (
          <EmptyState hasFilters={false} entityName="مادة دراسية" />
        )}

        {!isPending && !error && subjects && subjects.length !== 0 && (
          <div className="mt-5 flex flex-col gap-4 rounded-lg border-2 border-gray-200 px-6 py-2">
            <h1 className="text-2xl font-semibold">المواد الدراسية</h1>
            {subjects.map((subject) => (
              <Link
                to={subject.id.toString()}
                key={subject.id.toString()}
                className="flex cursor-pointer items-center gap-2 rounded-lg border-2 border-gray-200 px-6 py-2 transition-colors duration-150 hover:bg-emerald-300/20"
              >
                <div className="flex-1 text-xl">{subject.name}</div>
                <div onClick={(event) => event.preventDefault()}>
                  <ActionMenu
                    item={subject}
                    checkReservedRoles={false}
                    editPermission={
                      PermissionKeys.ACADEMIC_EDUCATIONAL_CONTENT_EDIT
                    }
                    onEdit={onEdit}
                  />
                </div>
              </Link>
            ))}
          </div>
        )}
      </PermissionGate>

      {isFormModalOpen && (
        <SubjectFormModal
          onClose={() => setIsFormModalOpen(false)}
          initialValues={subjectBeingEdited}
        />
      )}
    </div>
  );
};

export default SubjectsListPage;
