import { EVALUATION_MAX_GRADE } from "@/pages/staff/AttendanceEvaluationsPage";
import {
  AttendanceStatus,
  type ClassStudent,
  type StudentAttendanceStatus,
} from "@/types/classes";
import { CircleSlash2, UserX } from "lucide-react";
import { useCallback } from "react";

// Map status to display names
const STATUS_DISPLAY_NAMES = {
  [AttendanceStatus.PRESENT]: "حاضر",
  [AttendanceStatus.ABSENT]: "غائب",
  [AttendanceStatus.LATE]: "متأخر",
  [AttendanceStatus.EXCUSED]: "معتذر",
};

interface StudentEvaluationItemProps {
  student: ClassStudent;
  attendanceStatus?: StudentAttendanceStatus;
  evaluationConfig: string[];
  onAttendanceChange: (studentId: number, status: AttendanceStatus) => void;
  onNotesChange: (studentId: number, notes: string) => void;
  onEvaluationChange: (
    studentId: number,
    criteriaIndex: number,
    grade: number,
  ) => void;
}

const StudentEvaluationItem = ({
  student,
  attendanceStatus,
  evaluationConfig,
  onAttendanceChange,
  onNotesChange,
  onEvaluationChange,
}: StudentEvaluationItemProps) => {
  const currentStatus = attendanceStatus?.status || AttendanceStatus.ABSENT;

  const canEvaluate = useCallback((status: AttendanceStatus): boolean => {
    return (
      status === AttendanceStatus.PRESENT || status === AttendanceStatus.LATE
    );
  }, []);

  const isEvaluable = canEvaluate(currentStatus);

  // Use emerald for evaluable statuses, gray for non-evaluable
  const statusColor = isEvaluable
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-gray-200 bg-gray-50 text-gray-600";

  // Evaluations will be null for non-evaluable statuses
  const evaluations = attendanceStatus?.evaluations || null;

  const handleGradeInput = (criteriaIndex: number, value: string) => {
    if (!isEvaluable) return;

    if (value === "") {
      onEvaluationChange(student.student_id, criteriaIndex, 0);
      return;
    }

    const grade = parseInt(value);
    if (isNaN(grade)) return;

    onEvaluationChange(student.student_id, criteriaIndex, grade);
  };

  const getGradeColor = (grade: number, maxGrade: number) => {
    if (grade === 0) return "text-gray-500 bg-gray-100";
    const percentage = (grade / maxGrade) * 100;
    if (percentage >= 80) return "text-emerald-600 bg-emerald-50";
    if (percentage >= 60) return "text-amber-600 bg-amber-50";
    return "text-rose-600 bg-rose-50";
  };

  const getDisplayValue = (grade: number) => {
    if (grade === 0) return "";
    return grade.toString();
  };

  const getPercentageDisplay = (grade: number, maxGrade: number) => {
    if (grade === 0) return "-";
    return `${Math.round((grade / maxGrade) * 100)}%`;
  };

  const getScoreDisplay = (grade: number, maxGrade: number) => {
    if (grade === 0) return `- / ${maxGrade}`;
    return `${grade} / ${maxGrade}`;
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 transition-all ${statusColor} ${
        isEvaluable ? "bg-white hover:shadow-sm" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isEvaluable ? "bg-emerald-100" : "bg-gray-200"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                isEvaluable ? "text-emerald-700" : "text-gray-600"
              }`}
            >
              {student.full_name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{student.full_name}</h3>
            <p className="text-xs text-gray-500">
              Student ID: {student.student_id}
            </p>
          </div>
        </div>

        {/* Attendance Status Selector */}
        <div className="flex flex-col items-end space-y-2">
          <span className="text-sm font-medium text-gray-700">حالة الحضور</span>
          <select
            value={currentStatus}
            onChange={(e) =>
              onAttendanceChange(
                student.student_id,
                e.target.value as AttendanceStatus,
              )
            }
            className={`rounded-lg border-2 px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 ${statusColor}`}
          >
            {Object.values(AttendanceStatus).map((status) => (
              <option key={status} value={status}>
                {STATUS_DISPLAY_NAMES[status]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Evaluation Matrix - Show for present and late students */}
      {isEvaluable && evaluationConfig.length > 0 && evaluations && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">التقييم</h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {evaluationConfig.map((evaluationName, index) => {
              const evaluation = evaluations[index];
              const currentGrade = evaluation?.grade ?? 0;

              return (
                <div
                  key={evaluationName}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      {evaluationName}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getScoreDisplay(currentGrade, EVALUATION_MAX_GRADE)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={EVALUATION_MAX_GRADE}
                      value={getDisplayValue(currentGrade)}
                      onChange={(e) => handleGradeInput(index, e.target.value)}
                      placeholder="0"
                      className="w-12 flex-1 rounded border border-gray-300 p-1 text-center text-xs placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <div
                      className={`flex-1 rounded px-2 py-1 text-center text-xs font-medium ${getGradeColor(currentGrade, EVALUATION_MAX_GRADE)}`}
                    >
                      {getPercentageDisplay(currentGrade, EVALUATION_MAX_GRADE)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <input
              type="text"
              placeholder="ملاحظات إضافية (اختياري)..."
              value={attendanceStatus?.notes || ""}
              onChange={(e) =>
                onNotesChange(student.student_id, e.target.value)
              }
              className="mt-4 w-full rounded border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
      )}

      {!isEvaluable && (
        <div className="mb-4">
          {currentStatus === AttendanceStatus.ABSENT && (
            <div className="flex items-center space-x-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <UserX className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  الطالب غائب
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  التقييم غير متاح للطلاب الغائبين
                </p>
              </div>
            </div>
          )}

          {currentStatus === AttendanceStatus.EXCUSED && (
            <div className="flex items-center space-x-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <CircleSlash2 className="h-4 w-4 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800">
                  الطالب معتذر
                </p>
                <p className="mt-1 text-xs text-amber-600">
                  التقييم غير متاح للطلاب المعتذرين
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentEvaluationItem;
