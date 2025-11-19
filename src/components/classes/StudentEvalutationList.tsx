import Spinner from "@/components/shared/Spinner";
import type { AttendanceStatus } from "@/types/classes";
import type { Class, ClassStudent, EvaluationCriteria } from "@/types/classes";
import { ArrowRight, User } from "lucide-react";
import StudentEvaluationItem from "./StudentEvaluationItem";

interface StudentEvaluationListProps {
  selectedClassId: number;
  teacherClasses?: Class[];
  classStudents?: ClassStudent[];
  studentsLoading: boolean;
  attendanceStatus: AttendanceStatus;
  evaluationConfig: EvaluationCriteria[];
  onAttendanceChange: (studentId: number, present: boolean) => void;
  onNotesChange: (studentId: number, notes: string) => void;
  onEvaluationChange: (
    studentId: number,
    criteriaIndex: number,
    grade: number,
  ) => void;
  onBackToClasses: () => void;
}

const StudentEvaluationList = ({
  selectedClassId,
  teacherClasses,
  classStudents,
  studentsLoading,
  attendanceStatus,
  evaluationConfig,
  onAttendanceChange,
  onNotesChange,
  onEvaluationChange,
  onBackToClasses,
}: StudentEvaluationListProps) => {
  const selectedClass = teacherClasses?.find((c) => c.id === selectedClassId);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">طلاب الصف</h2>
          <p className="mt-1 text-sm text-gray-500">{selectedClass?.name}</p>
        </div>
        <button
          onClick={onBackToClasses}
          className="flex cursor-pointer items-center space-x-2 text-sm text-emerald-600 hover:text-emerald-700"
        >
          <ArrowRight className="h-4 w-4" />
          <span>العودة إلى قائمة الصفوف</span>
        </button>
      </div>

      {studentsLoading ? (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      ) : classStudents && classStudents.length > 0 ? (
        <div className="space-y-4">
          {classStudents.map((student) => (
            <StudentEvaluationItem
              key={student.student_id}
              student={student}
              attendanceStatus={attendanceStatus[student.student_id]}
              evaluationConfig={evaluationConfig}
              onAttendanceChange={onAttendanceChange}
              onNotesChange={onNotesChange}
              onEvaluationChange={onEvaluationChange}
            />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <User className="mx-auto mb-3 h-12 w-12 text-gray-400" />
          <p>لا يوجد طلاب مسجلين في هذا الصف</p>
        </div>
      )}
    </div>
  );
};

export default StudentEvaluationList;
