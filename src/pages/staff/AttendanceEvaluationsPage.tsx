import ClassSelectionGrid from "@/components/classes/ClassSelectionGrid";
import EvaluationHistory from "@/components/classes/EvaluationHistory";
import EvaluationsActionButtons from "@/components/classes/EvaluationsActionButtons";
import StudentEvaluationList from "@/components/classes/StudentEvalutationList";
import Spinner from "@/components/shared/Spinner";
import { useGetClassStudents } from "@/hooks/classes/useGetClassStudents";
import { useGetTeacherClasses } from "@/hooks/classes/useGetTeacherClasses";
import { useCreateBulkEvaluation } from "@/hooks/evaluations/useCreateBulkEvaluation";
import { useEditBulkEvaluation } from "@/hooks/evaluations/useEditBulkEvaluation";
import { useAuthStore } from "@/stores/auth";
import {
  AttendanceStatus,
  type EvaluationGrade,
  type AttendanceStatusMap,
  type Evaluation,
} from "@/types/classes";
import { getLocalDateString } from "@/utils/formatDate";
import { useState, useEffect, useCallback } from "react";

export const EVALUATION_MAX_GRADE = 10;

const AttendanceEvaluationsPage = () => {
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatusMap>(
    {},
  );
  const [evaluationEditMode, setEvaluationEditMode] = useState<boolean>(false);
  const [classDate, setClassDate] = useState(new Date());

  const { createBulkEvaluation, isPending: isCreatingEvaluation } =
    useCreateBulkEvaluation(setSelectedClassId);

  const { editBulkEvaluation, isPending: isEditingEvaluation } =
    useEditBulkEvaluation(setSelectedClassId);

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

  useEffect(() => {
    if (!selectedClassId) {
      setEvaluationEditMode(false);
    }
  }, [selectedClassId]);

  const initializeEvaluations = useCallback((): EvaluationGrade[] => {
    return (
      selectedClass?.evaluation_config.map((evaluation_name) => ({
        name: evaluation_name,
        grade: 0,
      })) || []
    );
  }, [selectedClass?.evaluation_config]);

  const canEvaluate = (status: AttendanceStatus): boolean => {
    return (
      status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE
    );
  };

  const handleAttendanceChange = useCallback(
    (studentId: number, attendance_status: AttendanceStatus) => {
      setAttendanceStatus((prev) => {
        const currentStatus = prev[studentId];
        const isEvaluable = canEvaluate(attendance_status);

        const evaluations = isEvaluable
          ? (currentStatus?.evaluations ?? initializeEvaluations())
          : null; // null for non-evaluable statuses

        return {
          ...prev,
          [studentId]: {
            attendance_status,
            notes: currentStatus?.notes ?? "",
            evaluations,
          },
        };
      });
    },
    [initializeEvaluations],
  );

  useEffect(() => {
    if (!evaluationEditMode) {
      for (const student of classStudents ?? []) {
        handleAttendanceChange(student.student_id, AttendanceStatus.ABSENT);
      }
    }
  }, [classStudents, evaluationEditMode, handleAttendanceChange]);

  const handleNotesChange = (studentId: number, notes: string) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
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

      // Only allow evaluation changes if student is present or late
      if (!canEvaluate(currentStudent.attendance_status)) {
        return prev;
      }

      // If evaluations is null or empty, initialize it first using class config
      let currentEvaluations = currentStudent.evaluations;

      if (!currentEvaluations || currentEvaluations.length === 0) {
        currentEvaluations = initializeEvaluations();
      }

      const updatedEvaluations = [...currentEvaluations];

      updatedEvaluations[criteriaIndex] = {
        name: selectedClass!.evaluation_config[criteriaIndex],
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
    if (evaluationEditMode) {
      editBulkEvaluation({
        class_id: selectedClassId!,
        date: getLocalDateString(classDate),
        records: attendanceStatus,
      });
    } else {
      createBulkEvaluation({
        class_id: selectedClassId!,
        date: getLocalDateString(classDate),
        records: attendanceStatus,
      });
    }
  };

  const handleBackToClasses = () => {
    setSelectedClassId(null);
    setAttendanceStatus({});
  };

  const handleEvaluationGroupChange = (
    classId: number,
    date: Date,
    evaluations: Evaluation[],
  ) => {
    setSelectedClassId(classId);
    handleClassDateChange(date);
    setEvaluationEditMode(true);
    setAttendanceStatus(() => {
      const map: AttendanceStatusMap = {};
      const currentClass = teacherClasses?.find((c) => c.id === classId);

      for (const evaluation of evaluations) {
        let evaluationGrades: EvaluationGrade[] = [];

        if (
          evaluation.evaluation_grades &&
          evaluation.evaluation_grades.length > 0
        ) {
          // If evaluation_grades exist, use them directly
          evaluationGrades = evaluation.evaluation_grades.map((grade) => ({
            name: grade.name,
            grade: grade.grade,
          }));
        } else if (
          currentClass?.evaluation_config &&
          canEvaluate(evaluation.attendance_status)
        ) {
          // If evaluation_grades is empty but student is evaluable, initialize with class config
          evaluationGrades = currentClass.evaluation_config.map(
            (evaluation_name) => ({
              name: evaluation_name,
              grade: 0,
            }),
          );
        }
        // If student is not evaluable (absent/excused), evaluationGrades remains empty array

        map[evaluation.student_id] = {
          attendance_status: evaluation.attendance_status,
          notes: evaluation.notes ?? "",
          evaluations: evaluationGrades.length > 0 ? evaluationGrades : null,
        };
      }
      return map;
    });
  };

  if (classesLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">تقييم الحضور</h1>

      {!selectedClassId ? (
        <>
          <ClassSelectionGrid
            teacherClasses={teacherClasses}
            onClassSelect={setSelectedClassId}
          />
          <EvaluationHistory
            teacherClasses={teacherClasses}
            onEvaluationGroupSelect={handleEvaluationGroupChange}
          />
        </>
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
            evaluationEditMode={evaluationEditMode}
            onAttendanceChange={handleAttendanceChange}
            onNotesChange={handleNotesChange}
            onEvaluationChange={handleEvaluationChange}
            onBackToClasses={handleBackToClasses}
            onClassDateChange={handleClassDateChange}
          />

          {classStudents && classStudents.length > 0 && (
            <EvaluationsActionButtons
              onSubmit={handleSubmit}
              isSubmitting={isCreatingEvaluation || isEditingEvaluation}
              onCancel={handleBackToClasses}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceEvaluationsPage;
