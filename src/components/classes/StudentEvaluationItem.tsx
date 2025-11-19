import type { ClassStudent, EvaluationCriteria } from "@/types/classes";

interface StudentEvaluationItemProps {
  student: ClassStudent;
  attendanceStatus?: {
    present: boolean;
    notes: string;
    evaluations?: {
      criteria: string;
      grade: number;
      max_grade: number;
    }[];
  };
  evaluationConfig: EvaluationCriteria[];
  onAttendanceChange: (studentId: number, present: boolean) => void;
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
  const isPresent = attendanceStatus?.present || false;
  const evaluations = attendanceStatus?.evaluations || [];

  const handleGradeInput = (criteriaIndex: number, value: string) => {
    if (!isPresent) return;

    if (value === "") {
      onEvaluationChange(student.student_id, criteriaIndex, 0);
      return;
    }

    const grade = parseInt(value);
    if (isNaN(grade)) return;

    const maxGrade = evaluationConfig[criteriaIndex].max_grade;
    onEvaluationChange(
      student.student_id,
      criteriaIndex,
      Math.min(Math.max(0, grade), maxGrade),
    );
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
      className={`rounded-lg border p-4 transition-all ${
        isPresent
          ? "border-emerald-200 bg-white hover:border-emerald-300"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              isPresent ? "bg-emerald-100" : "bg-gray-200"
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                isPresent ? "text-emerald-700" : "text-gray-600"
              }`}
            >
              {student.full_name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{student.full_name}</h3>
            <p className="text-xs text-gray-500">ID: {student.student_id}</p>
          </div>
        </div>

        {/* Attendance Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id={`attendance-${student.student_id}`}
            checked={isPresent}
            onChange={(e) =>
              onAttendanceChange(student.student_id, e.target.checked)
            }
            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
          />
          <label
            htmlFor={`attendance-${student.student_id}`}
            className={`text-sm font-medium ${
              isPresent ? "text-emerald-700" : "text-gray-600"
            }`}
          >
            {isPresent ? "حاضر" : "غائب"}
          </label>
        </div>
      </div>

      {/* Evaluation Matrix */}
      {isPresent && evaluationConfig.length > 0 && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">التقييم</h4>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {evaluationConfig.map((criteria, index) => {
              const evaluation = evaluations[index];
              const currentGrade = evaluation?.grade ?? 0;
              const maxGrade = criteria.max_grade;

              return (
                <div
                  key={criteria.name}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-700">
                      {criteria.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getScoreDisplay(currentGrade, maxGrade)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="0"
                      max={maxGrade}
                      value={getDisplayValue(currentGrade)}
                      onChange={(e) => handleGradeInput(index, e.target.value)}
                      placeholder="0"
                      className="w-12 rounded border border-gray-300 p-1 text-center text-xs placeholder:text-gray-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    />
                    <div
                      className={`flex-1 rounded px-2 py-1 text-center text-xs font-medium ${getGradeColor(currentGrade, maxGrade)}`}
                    >
                      {getPercentageDisplay(currentGrade, maxGrade)}
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

      {/* Absent Message */}
      {!isPresent && (
        <div className="mb-4 rounded-lg bg-amber-50 p-3">
          <div className="flex items-center space-x-2 text-xs text-amber-700">
            <span>⚠️</span>
            <span>التقييم غير متاح للطالب الغائب</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentEvaluationItem;
