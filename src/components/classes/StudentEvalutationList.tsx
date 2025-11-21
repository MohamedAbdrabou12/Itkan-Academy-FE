import Spinner from "@/components/shared/Spinner";
import type {
  AttendanceStatus,
  StudentAttendanceStatus,
  Weekday,
} from "@/types/classes";
import type { Class, ClassStudent } from "@/types/classes";
import { ArrowRight, User, Calendar } from "lucide-react";
import StudentEvaluationItem from "./StudentEvaluationItem";
import { useState, useCallback, useEffect, useMemo } from "react";
import { englishToArabicDayMap } from "@/utils/getArabicDayName";

// Define the type for the attendance status prop
type AttendanceStatusMap = Record<number, StudentAttendanceStatus>;

interface StudentEvaluationListProps {
  selectedClassId: number;
  teacherClasses?: Class[];
  classStudents?: ClassStudent[];
  studentsLoading: boolean;
  classDate: Date;
  attendanceStatus: AttendanceStatusMap;
  evaluationConfig: string[];
  onAttendanceChange: (studentId: number, status: AttendanceStatus) => void;
  onNotesChange: (studentId: number, notes: string) => void;
  onEvaluationChange: (
    studentId: number,
    criteriaIndex: number,
    grade: number,
  ) => void;
  onBackToClasses: () => void;
  onClassDateChange: (date: Date) => void;
}

const StudentEvaluationList = ({
  selectedClassId,
  teacherClasses,
  classStudents,
  classDate,
  studentsLoading,
  attendanceStatus,
  evaluationConfig,
  onAttendanceChange,
  onNotesChange,
  onEvaluationChange,
  onBackToClasses,
  onClassDateChange,
}: StudentEvaluationListProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedClass = teacherClasses?.find((c) => c.id === selectedClassId);

  const isDateInPastOrToday = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare dates only
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate <= today;
  };

  const isValidClassDay = useCallback(
    (date: Date) => {
      const dayName = date
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase() as Weekday;

      return (
        selectedClass?.schedule[dayName] &&
        selectedClass.schedule[dayName].length > 0
      );
    },
    [selectedClass?.schedule],
  );

  const minDatePickerValue = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date;
  }, []);

  const getNextValidDate = (currentDate: Date, direction: number) => {
    const newDate = new Date(currentDate);
    let attempts = 7;

    while (attempts--) {
      newDate.setDate(newDate.getDate() + direction);

      if (isValidClassDay(newDate) && isDateInPastOrToday(newDate)) {
        return newDate;
      }
    }

    return currentDate;
  };

  useEffect(() => {
    onClassDateChange(getNextValidDate(classDate, -1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatDateAsHtmlInput = (date: Date) =>
    date.toISOString().split("T")[0];

  // Format date for display
  const formattedDate = classDate.toLocaleDateString("ar-SA", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Format date for input value (YYYY-MM-DD)
  const inputDateValue = formatDateAsHtmlInput(classDate);

  const goToMostRecent = () => {
    const today = new Date();
    if (isValidClassDay(today) && isDateInPastOrToday(today)) {
      onClassDateChange(today);
    } else {
      const previousClassDate = getNextValidDate(today, -1);
      onClassDateChange(previousClassDate);
    }
  };

  const getClassTimes = (date: Date) => {
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as Weekday;
    return selectedClass?.schedule[dayName] || [];
  };

  // Handle date change from date picker
  const handleDateChange = (newDate: Date) => {
    if (isValidClassDay(newDate) && isDateInPastOrToday(newDate)) {
      onClassDateChange(newDate);
      setShowDatePicker(false);
    }
  };

  const currentClassTimes = getClassTimes(classDate);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">طلاب الصف</h2>
          <p className="mt-1 text-sm text-gray-500">{selectedClass?.name}</p>

          <div className="mt-3 flex flex-col space-y-3">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="relative">
                <button
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center space-x-2 space-x-reverse rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>{formattedDate}</span>
                  {!isDateInPastOrToday(classDate) && (
                    <span className="text-xs text-red-500">
                      (تاريخ مستقبلي)
                    </span>
                  )}
                </button>

                {showDatePicker && (
                  <div className="absolute left-0 top-full z-10 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-900">
                        اختر تاريخ الحصة
                      </h3>
                      <button
                        onClick={goToMostRecent}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        أقرب حصة
                      </button>
                    </div>
                    <input
                      type="date"
                      value={inputDateValue}
                      onChange={(e) =>
                        handleDateChange(new Date(e.target.value))
                      }
                      className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                      min={formatDateAsHtmlInput(minDatePickerValue)}
                      max={formatDateAsHtmlInput(
                        getNextValidDate(new Date(), -1),
                      )}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      أيام الحصص:{" "}
                      {Object.keys(selectedClass?.schedule ?? {})
                        .map((day) => englishToArabicDayMap[day as Weekday])
                        .join("، ")}
                    </p>
                    <p className="mt-1 text-xs text-amber-600">
                      ⚠️ يمكنك اختيار التواريخ السابقة أو تاريخ اليوم فقط
                    </p>
                  </div>
                )}
              </div>
            </div>

            {currentClassTimes.length > 0 && (
              <div className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600">
                <span>مواعيد الحصة:</span>
                <div className="flex space-x-2 space-x-reverse">
                  {currentClassTimes.map((time, index) => (
                    <span
                      key={index}
                      className="rounded-full bg-emerald-100 px-3 py-1 text-emerald-800"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">
              <span>جدول الحصص: </span>
              {Object.entries(selectedClass?.schedule ?? {}).map(
                ([day, times]) => (
                  <span key={day} className="mx-1">
                    {englishToArabicDayMap[day as Weekday]} ({times.join("، ")})
                  </span>
                ),
              )}
            </div>

            {!isDateInPastOrToday(classDate) && (
              <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                <p>
                  ⚠️ هذا التاريخ في المستقبل. يمكنك فقط اختيار التواريخ السابقة
                  أو تاريخ اليوم.
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          onClick={onBackToClasses}
          className="flex cursor-pointer items-center space-x-2 space-x-reverse text-sm text-emerald-600 hover:text-emerald-700"
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
