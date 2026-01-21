import clsx from "clsx";
import {
  StudentProgressStatus,
  type StudentProgressEntry,
  type StudentProgressUnitItemInfo,
} from "@/types/studentProgress";
import { useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import StudentProgressItem from "./StudentProgressItem";

export interface StudentProgressSubjectGroupProps {
  subjectName: string;
  curriculumName: string;
  unitItemsInfo: StudentProgressUnitItemInfo[];
  progressItems: StudentProgressEntry[];
  forceRectangularShape?: boolean;
}

const StudentProgressSubjectGroup = ({
  subjectName,
  curriculumName,
  unitItemsInfo,
  progressItems,
  forceRectangularShape,
}: StudentProgressSubjectGroupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const incompleteUnitItems = useMemo(() => {
    return unitItemsInfo.filter(
      (unitItem) =>
        !progressItems
          .map((item) => item.unit_item_info.id)
          .includes(unitItem.id),
    );
  }, [progressItems, unitItemsInfo]);

  const progressPercentage = useMemo(() => {
    return (
      progressItems.filter(
        (item) => item.status !== StudentProgressStatus.FAILED,
      ).length / unitItemsInfo.length
    );
  }, [progressItems, unitItemsInfo.length]);

  const progressPercentageDisplay = useMemo(
    () => Math.ceil(progressPercentage * 100),
    [progressPercentage],
  );

  const progressBarDiv = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "flex cursor-pointer flex-col gap-2 border-gray-200 px-6 py-2 transition-colors duration-150",
          isDropdownOpen ? "bg-emerald-400/15" : "hover:bg-emerald-300/15",
          (forceRectangularShape ?? false) ? "" : "first:rounded-t-lg",
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

          <div className="flex-1 text-xl">{subjectName} - {curriculumName}</div>
          <div className="text-lg">متقدم {progressPercentageDisplay}%</div>
        </div>
        <div
          ref={progressBarDiv}
          className="flex h-4 overflow-hidden rounded-3xl border-2 border-gray-400"
        >
          <div
            className="h-full bg-emerald-300"
            style={{
              flex: progressPercentage,
            }}
          />
        </div>
      </div>
      {isDropdownOpen && (
        <div>
          {progressItems.map((item) => (
            <StudentProgressItem
              key={`progress-${item.id}`}
              className="not-last:border-b-2"
              type="started"
              progressItem={item}
            />
          ))}
          {incompleteUnitItems.map((item) => (
            <StudentProgressItem
              key={`unit-item-${item.id}`}
              className="not-last:border-b-2"
              type="incomplete"
              unitItem={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentProgressSubjectGroup;
