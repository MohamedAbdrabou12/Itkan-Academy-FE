import ClassSelectionGrid from "@/components/classes/ClassSelectionGrid";
import EvaluationsActionButtons from "@/components/classes/EvaluationsActionButtons";
import StudentEvaluationList from "@/components/classes/StudentEvalutationList";
import Spinner from "@/components/shared/Spinner";
import { useGetClassStudents } from "@/hooks/classes/useGetClassStudents";
import { useGetTeacherClasses } from "@/hooks/classes/useGetTeacherClasses";
import { useCreateBulkEvaluation } from "@/hooks/evaluations/useCreateBulkEvaluation";
import { useAuthStore } from "@/stores/auth";
import {
  AttendanceStatus,
  type EvaluationGrade,
  type AttendanceStatusMap,
} from "@/types/classes";
import { useState, useEffect } from "react";

export const EVALUATION_MAX_GRADE = 10;

const AttendanceEvaluationsPage = () => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatusMap>(
    {},
  );
  const [classDate, setClassDate] = useState(new Date());

  const { createBulkEvaluation } = useCreateBulkEvaluation();

  const { user, activeBranch } = useAuthStore();

  const { teacherClasses, isPending: classesLoading } = useGetTeacherClasses(
    user,
    activeBranch,
  );
  const { classStudents, isPending: studentsLoading } =
    useGetClassStudents(selectedClassId);

  const selectedClass = teacherClasses?.find((c) => c.id === selectedClassId);

  // Reset everything when active branch changes
  useEffect(() => {
    setSelectedClassId(null);
    setAttendanceStatus({});
  }, [activeBranch?.id]);

  const initializeEvaluations = (): EvaluationGrade[] => {
    return (
      selectedClass?.evaluation_config.map((evaluation_name) => ({
        name: evaluation_name,
        grade: 0,
      })) || []
    );
  };

  const handleAttendanceChange = (
    studentId: number,
    status: AttendanceStatus,
  ) => {
    setAttendanceStatus((prev) => {
      const currentStatus = prev[studentId];
      const isPresent = status === AttendanceStatus.PRESENT;

      const evaluations = isPresent
        ? currentStatus?.evaluations || initializeEvaluations()
        : currentStatus?.evaluations?.map((evalItem) => ({
            ...evalItem,
            grade: 0,
          })) || initializeEvaluations();

      return {
        ...prev,
        [studentId]: {
          status,
          notes: currentStatus?.notes || "",
          evaluations,
        },
      };
    });
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status: prev[studentId]?.status || AttendanceStatus.ABSENT,
        notes,
        evaluations: prev[studentId]?.evaluations || initializeEvaluations(),
      },
    }));
  };

  const handleEvaluationChange = (
    studentId: number,
    criteriaIndex: number,
    grade: number,
  ) => {
    setAttendanceStatus((prev) => {
      const currentStudent = prev[studentId];
      if (!currentStudent) return prev;

      const updatedEvaluations = [...currentStudent.evaluations];
      updatedEvaluations[criteriaIndex] = {
        ...updatedEvaluations[criteriaIndex],
        grade: Math.min(Math.max(0, grade), EVALUATION_MAX_GRADE),
      };

      return {
        ...prev,
        [studentId]: {
          ...currentStudent,
          evaluations: updatedEvaluations,
        },
      };
    });
  };

  const handleClassDateChange = (date: Date) => {
    const newDateWithoutTime = new Date(date);
    newDateWithoutTime.setHours(0, 0, 0, 0);

    setClassDate(newDateWithoutTime);
  };

  const handleSubmit = () => {
    createBulkEvaluation({
      class_id: selectedClassId!,
      date: classDate.toLocaleDateString("en-US"),
      records: attendanceStatus,
    });
  };

  const handleBackToClasses = () => {
    setSelectedClassId(null);
    setAttendanceStatus({});
  };

  if (classesLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">تقييم الحضور</h1>

      {!selectedClassId ? (
        <ClassSelectionGrid
          teacherClasses={teacherClasses}
          onClassSelect={setSelectedClassId}
        />
      ) : (
        <>
          <StudentEvaluationList
            selectedClassId={selectedClassId}
            teacherClasses={teacherClasses}
            classStudents={classStudents}
            classDate={classDate}
            studentsLoading={studentsLoading}
            attendanceStatus={attendanceStatus}
            evaluationConfig={selectedClass?.evaluation_config || []}
            onAttendanceChange={handleAttendanceChange}
            onNotesChange={handleNotesChange}
            onEvaluationChange={handleEvaluationChange}
            onBackToClasses={handleBackToClasses}
            onClassDateChange={handleClassDateChange}
          />

          {classStudents && classStudents.length > 0 && (
            <EvaluationsActionButtons
              onSubmit={handleSubmit}
              onCancel={handleBackToClasses}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceEvaluationsPage;
