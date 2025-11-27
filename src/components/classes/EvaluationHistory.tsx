import { useGetEvaluations } from "@/hooks/evaluations/useGetEvaluations";
import { useAuthStore } from "@/stores/auth";
import type { Class, Evaluation } from "@/types/classes";
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

const EvaluationHistory: React.FC<EvaluationHistoryProps> = (props) => {
  const { user, activeBranch } = useAuthStore();
  const { evaluations } = useGetEvaluations(user, activeBranch);

  const evaluationsGroupedByDate = useMemo(() => {
    const groups: Record<
      string,
      {
        class_id: number;
        date: number;
        evaluations: Evaluation[];
      }
    > = {};

    for (const evaluation of evaluations ?? []) {
      if (!groups[evaluation.date]) {
        groups[evaluation.date] = {
          class_id: evaluation.class_id,
          date: new Date(evaluation.date).getTime(),
          evaluations: [evaluation],
        };
      } else {
        groups[evaluation.date].evaluations.push(evaluation);
      }
    }

    return Object.values(groups).sort((a, b) => b.date - a.date);
  }, [evaluations]);

  if (!evaluations) return <Spinner />;

  return evaluationsGroupedByDate.map((evaluationGroup) => {
    const teacherClass = props.teacherClasses?.find(
      (c) => c.id === evaluationGroup.class_id,
    );

    if (!teacherClass) return null;

    const date = new Date(evaluationGroup.date);
    const formattedDate = date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });

    return (
      <div
        className="mt-2 flex min-h-12 cursor-pointer items-center rounded-lg border border-gray-300 bg-white pr-2 shadow-lg transition-shadow hover:shadow-2xl"
        key={`${evaluationGroup.class_id}-${evaluationGroup.date}`}
        onClick={() =>
          props.onEvaluationGroupSelect(
            evaluationGroup.class_id,
            date,
            evaluationGroup.evaluations,
          )
        }
      >
        {formattedDate} - {teacherClass.name}
      </div>
    );
  });
};

export default EvaluationHistory;
