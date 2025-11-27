import Spinner from "@/components/shared/Spinner";
import { useClickOutsideModal } from "@/hooks/useClickOutsideModal";
import type {
  AttendanceStatus,
  AttendanceStatusMap,
  Class,
  ClassStudent,
  Weekday,
} from "@/types/classes";
import { getLocalDateString } from "@/utils/formatDate";
import { englishToArabicDayMap } from "@/utils/getArabicDayName";
import { ArrowRight, Calendar, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import StudentEvaluationItem from "./StudentEvaluationItem";

interface StudentEvaluationListProps {
  selectedClassId: number;
  teacherClasses?: Class[];
  classStudents?: ClassStudent[];
  studentsLoading: boolean;
  classDate: Date;
  attendanceStatus: AttendanceStatusMap;
  evaluationConfig: string[];
  evaluationEditMode: boolean | null;
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
  evaluationEditMode,
  onAttendanceChange,
  onNotesChange,
  onEvaluationChange,
  onBackToClasses,
  onClassDateChange,
}: StudentEvaluationListProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedClass = teacherClasses?.find((c) => c.id === selectedClassId);
  const datePickerRef = useRef(null);

  useClickOutsideModal(datePickerRef, () => {
    setShowDatePicker(false);
  });

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

  const isValidDateForClass = useCallback(
    (date: Date) => {
      return isDateInPastOrToday(date) && isValidClassDay(date);
    },
    [isValidClassDay],
  );

  // Get all valid class dates within a range
  const getValidClassDates = useMemo(() => {
    const validDates: Date[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 3); // Look back 3 days

    const endDate = new Date(); // Today

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      if (isValidDateForClass(d)) {
        validDates.push(new Date(d));
      }
    }

    // Reverse the array to have newest dates first
    return validDates.reverse();
  }, [isValidDateForClass]);

  // Find the nearest previous class date (most recent valid date)
  const getNearestPreviousClassDate = useCallback(() => {
    const validDates = getValidClassDates;
    if (validDates.length === 0) {
      return new Date(); // Fallback to today if no valid dates
    }

    // reverse chronological order (newest first),
    return validDates[0];
  }, [getValidClassDates]);

  // Initialize with the nearest previous class date
  useEffect(() => {
    if (!evaluationEditMode && getValidClassDates.length > 0) {
      const nearestDate = getNearestPreviousClassDate();
      onClassDateChange(nearestDate);
    }
  }, [
    evaluationEditMode,
    getValidClassDates,
    getNearestPreviousClassDate,
    onClassDateChange,
  ]);

  const goToMostRecent = () => {
    if (getValidClassDates.length > 0) {
      const nearestDate = getNearestPreviousClassDate();
      onClassDateChange(nearestDate);
    }
  };

  // Format date for display
  const formattedDate = classDate.toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const inputDateValue = getLocalDateString(classDate);

  const getClassTimes = (date: Date) => {
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase() as Weekday;
    return selectedClass?.schedule[dayName] || [];
  };

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);

    if (isValidDateForClass(newDate)) {
      onClassDateChange(newDate);
      setShowDatePicker(false);
    }
  };

  // Helper functions for date input min/max
  const getMinDateValue = () => {
    if (getValidClassDates.length === 0) return getLocalDateString(new Date());
    const oldestDate = getValidClassDates[getValidClassDates.length - 1];
    return getLocalDateString(oldestDate);
  };

  const getMaxDateValue = () => {
    if (getValidClassDates.length === 0) return getLocalDateString(new Date());
    const newestDate = getValidClassDates[0];
    return getLocalDateString(newestDate);
  };

  const currentClassTimes = getClassTimes(classDate);

  // Get class schedule days in Arabic
  const classScheduleDays = useMemo(() => {
    return Object.keys(selectedClass?.schedule ?? {})
      .map((day) => englishToArabicDayMap[day as Weekday])
      .join("، ");
  }, [selectedClass?.schedule]);

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-800">طلاب الصف</h2>
          <p className="mt-1 text-sm text-gray-500">{selectedClass?.name}</p>

          <div className="mt-3 flex flex-col space-y-3">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="flex items-center ">
                {/* Date Picker */}
                {evaluationEditMode ? (
                  formattedDate
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="w-md flex items-center gap-2  rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{formattedDate}</span>
                    </button>

                    {showDatePicker && (
                      <div
                        ref={datePickerRef}
                        className="w-md absolute left-0 top-full z-10 mt-1 rounded-lg border border-gray-200 bg-white p-4 shadow-lg rtl:left-auto rtl:right-0"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            اختر تاريخ الحصة
                          </h3>
                          <button
                            onClick={goToMostRecent}
                            className="text-xs text-emerald-600 hover:text-emerald-700"
                          >
                            أحدث حصة
                          </button>
                        </div>

                        <input
                          type="date"
                          value={inputDateValue}
                          onChange={handleNativeDateChange}
                          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                          min={getMinDateValue()}
                          max={getMaxDateValue()}
                          list="validClassDates"
                          title="يمكنك اختيار تواريخ الحصص السابقة أو حصة اليوم فقط"
                        />

                        <datalist id="validClassDates">
                          {getValidClassDates.map((date) => (
                            <option
                              key={date.toISOString()}
                              value={getLocalDateString(date)}
                            />
                          ))}
                        </datalist>

                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-gray-500">
                            أيام الحصص: {classScheduleDays}
                          </p>
                          <p className="text-xs text-amber-600">
                            ⚠️ يمكنك اختيار تواريخ الحصص السابقة أو حصة اليوم
                            فقط
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {currentClassTimes.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>مواعيد الحصة:</span>
                <div className="flex">
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
              <span>أيام الحصص: {classScheduleDays}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onBackToClasses}
          className="flex cursor-pointer items-center  text-sm text-emerald-600 hover:text-emerald-700"
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
