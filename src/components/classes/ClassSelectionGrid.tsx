import type { Class } from "@/types/classes";
import { ChevronLeft } from "lucide-react";

interface ClassSelectionGridProps {
  teacherClasses?: Class[];
  onClassSelect: (classId: number) => void;
}

const ClassSelectionGrid = ({
  teacherClasses,
  onClassSelect,
}: ClassSelectionGridProps) => {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-gray-700">اختر الصف</h2>

      {teacherClasses && teacherClasses.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {teacherClasses.map((classItem) => (
            <div
              key={classItem.id}
              className="cursor-pointer rounded-xl border-2 border-gray-200 bg-white p-5 transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
              onClick={() => onClassSelect(classItem.id)}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  {classItem.name}
                </h3>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
                  <ChevronLeft className="h-3 w-3 text-gray-600" />
                </div>
              </div>

              {classItem.schedule && (
                <div className="mt-3 space-y-2">
                  <div className="text-sm font-medium text-gray-600">
                    الجدول:
                  </div>
                  {Object.entries(classItem.schedule).map(([day, time]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        {getArabicDayName(day)}
                      </span>
                      <span className="font-medium text-emerald-600">
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">لا توجد صفوف متاحة</p>
        </div>
      )}
    </div>
  );
};

// Helper function to convert English day names to Arabic
const getArabicDayName = (englishDay: string): string => {
  const dayMap: { [key: string]: string } = {
    sunday: "الأحد",
    monday: "الإثنين",
    tuesday: "الثلاثاء",
    wednesday: "الأربعاء",
    thursday: "الخميس",
    friday: "الجمعة",
    saturday: "السبت",
  };
  return dayMap[englishDay.toLowerCase()] || englishDay;
};

export default ClassSelectionGrid;
