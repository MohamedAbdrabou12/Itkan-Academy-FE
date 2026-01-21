import type { StudentProgressBySubjectList } from "@/types/studentProgress";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import StudentProgressSubjectGroup from "./StudentProgressSubjectGroup";

export interface StudentProgressItemStudentGroupProps {
  studentName: string;
  groups: StudentProgressBySubjectList;
}

const StudentProgressStudentGroup = ({
  studentName,
  groups,
}: StudentProgressItemStudentGroupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="group flex flex-col border-gray-200 not-last:border-b-4">
      <div
        className={clsx(
          "flex cursor-pointer flex-col gap-2 px-6 py-4 transition-colors duration-150 group-first:rounded-t-lg",
          isDropdownOpen ? "bg-emerald-400/20" : "hover:bg-emerald-300/20",
        )}
        onClick={() => setIsDropdownOpen((open) => !open)}
      >
        <div className="flex items-center gap-2">
          <ChevronDown
            className={clsx(
              "transition-transform",
              isDropdownOpen ? "rotate-0" : "rotate-90",
            )}
          />

          <div className="text-xl font-semibold">{studentName}</div>
        </div>
      </div>
      {isDropdownOpen &&
        groups.map(({ subject_id, subject_name, curriculum_name, unit_items_info, items }) => (
          <StudentProgressSubjectGroup
            key={subject_id}
            subjectName={subject_name}
            curriculumName={curriculum_name}
            unitItemsInfo={unit_items_info}
            progressItems={items}
            forceRectangularShape={true}
          />
        ))}
    </div>
  );
};

export default StudentProgressStudentGroup;
