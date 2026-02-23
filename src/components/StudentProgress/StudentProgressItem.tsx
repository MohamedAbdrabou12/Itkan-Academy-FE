import clsx from "clsx";
import {
  StudentProgressStatus,
  type StudentProgressEntry,
  type StudentProgressUnitItemInfo,
} from "@/types/studentProgress";
import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { formatArabicDate } from "@/utils/formatDate";
import { attendanceStatusDisplayNames } from "@/utils/attendanceStatusDisplayNames";
import { AttendanceStatus } from "@/types/classes";
import RingProgressBar from "./RingProgressBar";

type StudentProgressItemProps = { className: string } & (
  | {
      type: "incomplete";
      unitItem: StudentProgressUnitItemInfo;
    }
  | {
      type: "started";
      progressItem: StudentProgressEntry;
    }
);

const StudentProgressItem = (props: StudentProgressItemProps) => {
  return (
    <div
      className={clsx(
        "flex items-center border-gray-200 px-6 py-2",
        props.className,
      )}
    >
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-2">
          <div className="text-lg">
            {props.type === "started"
              ? `${props.progressItem.unit_item_info.unit_info.title} - ${props.progressItem.unit_item_info.title}`
              : `${props.unitItem.unit_info.title} - ${props.unitItem.title}`}
          </div>
          <div
            className={clsx(
              "flex gap-1 rounded-3xl p-2 text-xs",
              props.type === "started" &&
                props.progressItem.status === StudentProgressStatus.PASSED
                ? "bg-emerald-300/50 text-green-700"
                : "",
              props.type === "started" &&
                props.progressItem.status === StudentProgressStatus.FAILED
                ? "bg-red-100 text-red-700"
                : "",
              props.type === "incomplete" ? "bg-gray-100 text-gray-500" : "",
            )}
          >
            {props.type === "started" ? (
              props.progressItem.status === StudentProgressStatus.PASSED ? (
                <>
                  <CircleCheck size="12" className="m-auto block" />
                  اكتمل
                </>
              ) : (
                <>
                  <CircleX size="12" className="m-auto block" />
                  فشل
                </>
              )
            ) : (
              <>
                <CircleAlert size="12" className="m-auto block" />
                غير مكتمل
              </>
            )}
          </div>
          {props.type === "started" && (
            <RingProgressBar
              value={props.progressItem.score / props.progressItem.max_score}
              failedColor={
                props.progressItem.score < props.progressItem.max_score / 2
              }
              className="mr-4"
            >
              {(
                (props.progressItem.score / props.progressItem.max_score) *
                100
              ).toFixed(2)}
              %
            </RingProgressBar>
          )}
        </div>
        {props.type === "started" && (
          <div className="text-lg">
            <div className="flex justify-between">
              {props.progressItem.evaluation_info && (
                <div className="flex gap-4">
                  <div className="font-semibold">
                    {
                      attendanceStatusDisplayNames[
                        props.progressItem.evaluation_info.attendance_status
                      ]
                    }
                  </div>
                  {(props.progressItem.evaluation_info.attendance_status ===
                    AttendanceStatus.PRESENT ||
                    props.progressItem.evaluation_info.attendance_status ===
                      AttendanceStatus.LATE) &&
                    props.progressItem.evaluation_info.evaluation_grades.map(
                      ({ name, grade }) => (
                        <div key={name}>
                          {name}: {grade}
                        </div>
                      ),
                    )}
                </div>
              )}
              <div>
                اكتمل:{" "}
                {formatArabicDate(new Date(props.progressItem.created_at))}
              </div>
            </div>
            {props.progressItem.evaluation_info?.notes && (
              <div>ملاحظات: {props.progressItem.evaluation_info.notes}</div>
            )}
          </div>
        )}
        <div className="mt-2 text-sm">
          محتوى الدرس:{" "}
          {props.type === "started"
            ? props.progressItem.unit_item_info.content
            : props.unitItem.content}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressItem;
