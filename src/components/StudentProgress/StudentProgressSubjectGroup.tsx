import clsx from "clsx";
import {
  StudentProgressStatus,
  type StudentProgressEntry,
  type StudentProgressUnitItemInfo,
} from "@/types/studentProgress";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import StudentProgressItem from "./StudentProgressItem";

export interface StudentProgressSubjectGroupProps {
  subjectName: string;
  unitItemsInfo: StudentProgressUnitItemInfo[];
  progressItems: StudentProgressEntry[];
  roundTopCorner: boolean;
}

const StudentProgressSubjectGroup = ({
  subjectName,
  unitItemsInfo,
  progressItems,
  roundTopCorner,
}: StudentProgressSubjectGroupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);

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

  useLayoutEffect(() => {
    setProgressBarWidth(
      Math.ceil(
        (progressBarDiv.current?.clientWidth ?? 0) * progressPercentage,
      ),
    );
  }, [progressBarDiv.current?.clientWidth, progressPercentage]);

  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "flex cursor-pointer flex-col gap-2 border-gray-200 px-6 py-2 transition-colors duration-150",
          isDropdownOpen ? "bg-emerald-400/20" : "hover:bg-emerald-300/20",
          roundTopCorner ? "rounded-t-lg" : "",
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

          <div className="flex-1 text-xl">{subjectName}</div>
          <div className="text-lg">متقدم {progressPercentageDisplay}%</div>
        </div>
        <div
          ref={progressBarDiv}
          className="h-4 overflow-hidden rounded-3xl border-2 border-gray-400"
        >
          <div
            className="h-full bg-emerald-300"
            style={{
              width: progressBarWidth,
            }}
          />
        </div>
      </div>
      {isDropdownOpen && (
        <div className="bg-emerald-200/30">
          {progressItems.map((item, index) => (
            <StudentProgressItem
              key={`progress-${item.id}`}
              className={
                index === progressItems.length + incompleteUnitItems.length - 1
                  ? ""
                  : "border-b-2"
              }
              type="started"
              progressItem={item}
            />
          ))}
          {incompleteUnitItems.map((item, index) => (
            <StudentProgressItem
              key={`unit-item-${item.id}`}
              className={
                index === progressItems.length + incompleteUnitItems.length - 1
                  ? ""
                  : "border-b-2"
              }
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
