import type { StudentProgressBySubjectList } from "@/types/studentProgress";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import StudentProgressSubjectGroup from "./StudentProgressSubjectGroup";

export interface StudentProgressItemStudentGroupProps {
  studentName: string;
  groups: StudentProgressBySubjectList;
  roundTopCorner: boolean;
}

const StudentProgressStudentGroup = ({
  studentName,
  groups,
  roundTopCorner,
}: StudentProgressItemStudentGroupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "flex cursor-pointer flex-col gap-2 border-gray-200 px-6 py-2 transition-colors duration-150",
          isDropdownOpen ? "bg-emerald-400/20" : "hover:bg-emerald-300/20",
          roundTopCorner ? "rounded-t-lg" : ""
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

          <div className="text-xl">{studentName}</div>
        </div>
      </div>
      {isDropdownOpen &&
        groups.map(({ subject_id, subject_name, unit_items_info, items }) => (
          <StudentProgressSubjectGroup
            key={subject_id}
            subjectName={subject_name}
            unitItemsInfo={unit_items_info}
            progressItems={items}
            roundTopCorner={false}
          />
        ))}
    </div>
  );
};

export default StudentProgressStudentGroup;
