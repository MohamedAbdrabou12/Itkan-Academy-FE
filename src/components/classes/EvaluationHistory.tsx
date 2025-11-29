import { useGetEvaluations } from "@/hooks/evaluations/useGetEvaluations";
import { useAuthStore } from "@/stores/auth";
import type { Class, Evaluation } from "@/types/classes";
import { formatArabicDate, formatArabicDatetime } from "@/utils/formatDate";
import { useMemo } from "react";
import Spinner from "../shared/Spinner";

export interface EvaluationHistoryProps {
  teacherClasses?: Class[];
  onEvaluationGroupSelect: (
    classId: number,
    date: Date,
    evaluations: Evaluation[],
  ) => void;
}

const EvaluationHistory = ({
  teacherClasses,
  onEvaluationGroupSelect,
}: EvaluationHistoryProps) => {
  const { user, activeBranch } = useAuthStore();
  const { evaluations } = useGetEvaluations(user, activeBranch);

  const evaluationsGroupedByDate = useMemo(() => {
    const dateGroups: Record<
      string,
      {
        date: number;
        formattedDate: string;
        formattedCreatedAt: string;
        classGroups: {
          class_id: number;
          evaluations: Evaluation[];
        }[];
      }
    > = {};

    for (const evaluation of evaluations ?? []) {
      const date = new Date(evaluation.date);
      const dateKey = evaluation.date;
      const formattedDate = formatArabicDate(date);
      const formattedCreatedAt = formatArabicDatetime(
        new Date(evaluation.created_at),
      );

      if (!dateGroups[dateKey]) {
        dateGroups[dateKey] = {
          date: date.getTime(),
          formattedDate,
          formattedCreatedAt,
          classGroups: [
            {
              class_id: evaluation.class_id,
              evaluations: [evaluation],
            },
          ],
        };
      } else {
        const existingClassGroup = dateGroups[dateKey].classGroups.find(
          (group) => group.class_id === evaluation.class_id,
        );

        if (existingClassGroup) {
          existingClassGroup.evaluations.push(evaluation);
        } else {
          dateGroups[dateKey].classGroups.push({
            class_id: evaluation.class_id,
            evaluations: [evaluation],
          });
        }
      }
    }

    return Object.values(dateGroups).sort((a, b) => b.date - a.date);
  }, [evaluations]);

  if (!evaluations) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Title Section */}
      <div className="text-right">
        <h2 className="text-2xl font-bold text-emerald-900">سجل التقييمات</h2>
      </div>

      {/* Evaluations List */}
      <div className="space-y-4">
        {evaluationsGroupedByDate.map((dateGroup) => (
          <div
            key={dateGroup.date}
            className="overflow-hidden rounded-lg border border-emerald-200 bg-white shadow-sm"
          >
            {/* Date Header */}
            <div className="bg-linear-to-r border-b border-emerald-200 from-emerald-50 to-green-50 px-4 py-3">
              <h3 className="text-right text-lg font-semibold text-emerald-900">
                {dateGroup.formattedDate}
              </h3>
            </div>

            {/* Class Records */}
            <div className="divide-y divide-emerald-100">
              {dateGroup.classGroups.map((classGroup) => {
                const teacherClass = teacherClasses?.find(
                  (c) => c.id === classGroup.class_id,
                );

                if (!teacherClass) return null;

                return (
                  <div
                    key={`${classGroup.class_id}-${dateGroup.date}`}
                    className="group cursor-pointer px-4 py-4 transition-all hover:bg-emerald-50 active:bg-emerald-100"
                    onClick={() =>
                      onEvaluationGroupSelect(
                        classGroup.class_id,
                        new Date(dateGroup.date),
                        classGroup.evaluations,
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 text-right">
                        <h4 className="text-lg font-medium text-emerald-900 group-hover:text-emerald-700">
                          {teacherClass.name}
                        </h4>
                      </div>
                      <div className="text-right text-gray-500">
                        {dateGroup.formattedCreatedAt}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationHistory;
