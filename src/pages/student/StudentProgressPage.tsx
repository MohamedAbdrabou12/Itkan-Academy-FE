import {
  useGetStudentProgressAsParent,
  useGetStudentProgressAsStudent,
} from "@/hooks/student_progress/useGetStudentProgress";
import { useAuthStore } from "@/stores/auth";
import UnauthorizedPage from "../UnauthorizedPage";
import { UserRole } from "@/types/Roles";
import Spinner from "@/components/shared/Spinner";
import GridError from "@/components/dataGrid/GridError";
import EmptyState from "@/components/dataGrid/EmptyState";
import StudentProgressSubjectGroup from "@/components/StudentProgress/StudentProgressSubjectGroup";
import StudentProgressStudentGroup from "@/components/StudentProgress/StudentProgressStudentGroup";
import clsx from "clsx";

const StudentRoleStudentProgressPage = () => {
  const { progressGroups, isPending, error } = useGetStudentProgressAsStudent();

  if (isPending) return <Spinner />;
  if (error) return <GridError message={error.message} />;
  if (!progressGroups || progressGroups?.length === 0)
    return <EmptyState hasFilters={false} entityName="تقدم" />;

  return progressGroups.map(
    ({ class_id, subject_id, subject_name, class_name, curriculum_name, unit_items_info, items }) => (
      <StudentProgressSubjectGroup
        key={`${class_id}-${subject_id}`}
        subjectName={subject_name}
        className={class_name}
        curriculumName={curriculum_name}
        unitItemsInfo={unit_items_info}
        progressItems={items}
      />
    ),
  );
};

const ParentRoleStudentProgressPage = () => {
  const { progressGroups, isPending, error } = useGetStudentProgressAsParent();

  if (isPending) return <Spinner />;
  if (error) return <GridError message={error.message} />;
  if (!progressGroups || progressGroups?.length === 0)
    return <EmptyState hasFilters={false} entityName="تقدم" />;

  return progressGroups.map(({ student_id, student_name, groups }) => (
    <StudentProgressStudentGroup
      key={student_id}
      studentName={student_name}
      groups={groups}
    />
  ));
};

const StudentProgressPage = () => {
  const role = useAuthStore((store) => store.user?.role_name);

  if (role !== UserRole.STUDENT && role !== UserRole.PARENT)
    return <UnauthorizedPage />;

  return (
    <div className="mx-24 my-16 rounded-lg border-2 border-gray-200 bg-white px-4 py-4">
      <div className="rounded-lg border-2 border-gray-200 px-6 py-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            متابعة التقدم
          </h1>
        </div>
      </div>

      <div
        className={clsx(
          "mt-5 flex flex-col rounded-lg border-2 border-gray-200",
          role === UserRole.STUDENT ? "gap-4" : "",
        )}
      >
        {role === UserRole.STUDENT ? (
          <StudentRoleStudentProgressPage />
        ) : (
          <ParentRoleStudentProgressPage />
        )}
      </div>
    </div>
  );
};

export default StudentProgressPage;
