import clsx from "clsx";
import {
  type StudentProgressEntry,
  type StudentProgressUnitItemInfo,
} from "@/types/studentProgress";
import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import StudentProgressItem from "./StudentProgressItem";
import RingProgressBar from "./RingProgressBar";

export interface StudentProgressClassGroupProps {
  className: string;
  subjectName: string;
  curriculumName: string;
  unitItemsInfo: StudentProgressUnitItemInfo[];
  progressItems: StudentProgressEntry[];
  forceRectangularShape?: boolean;
}

const StudentProgressClassGroup = ({
  className,
  subjectName,
  curriculumName,
  unitItemsInfo,
  progressItems,
  forceRectangularShape,
}: StudentProgressClassGroupProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const incompleteUnitItems = useMemo(() => {
    return unitItemsInfo.filter(
      (unitItem) =>
        !progressItems
          .map((item) => item.unit_item_info.id)
          .includes(unitItem.id),
    );
  }, [progressItems, unitItemsInfo]);

  const progressPercentage = progressItems.length / unitItemsInfo.length;

  const { score: gradesScore, maxScore: gradesMaxScore } = useMemo(
    () =>
      progressItems.reduce(
        (prev, curr) => ({
          score: prev.score + curr.score,
          maxScore: prev.maxScore + curr.max_score,
        }),
        { score: 0, maxScore: 0 },
      ),
    [progressItems],
  );

  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          "flex cursor-pointer items-center gap-2 border-gray-200 px-6 py-2 transition-colors duration-150",
          isDropdownOpen ? "bg-emerald-400/15" : "hover:bg-emerald-300/15",
          (forceRectangularShape ?? false) ? "" : "first:rounded-t-lg",
        )}
        onClick={() => setIsDropdownOpen((open) => !open)}
      >
        <ChevronDown
          className={clsx(
            "transition-transform",
            isDropdownOpen ? "rotate-0" : "rotate-90",
          )}
        />

        <div className="text-xl">{className}</div>
        <div className="flex flex-1 gap-2">
          <div className="rounded-3xl bg-emerald-300/50 p-2 text-sm text-green-700">
            المادة: {subjectName}
          </div>
          <div className="rounded-3xl bg-emerald-300/50 p-2 text-sm text-green-700">
            المستوى: {curriculumName}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xl">تقدم</div>
          <RingProgressBar className="flex flex-col" value={progressPercentage}>
            {progressItems.length}
            <hr className="w-6 h-1" />
            {unitItemsInfo.length}
          </RingProgressBar>

          <div className="text-xl">درجات</div>
          <RingProgressBar
            value={gradesScore / gradesMaxScore}
            failedColor={gradesScore < gradesMaxScore / 2}
          >
            {((gradesScore / gradesMaxScore) * 100).toFixed(2)}%
          </RingProgressBar>
        </div>
      </div>
      {isDropdownOpen && (
        <div>
          {progressItems.map((item) => (
            <StudentProgressItem
              key={item.id}
              className="not-last:border-b-2"
              type="started"
              progressItem={item}
            />
          ))}
          {incompleteUnitItems.map((item) => (
            <StudentProgressItem
              key={item.id}
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

export default StudentProgressClassGroup;
