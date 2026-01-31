import type { EvaluationStatus } from "@/types/staffEvaluation";

interface EvaluationStatusBadgeProps {
  status: EvaluationStatus;
}

export const EvaluationStatusBadge = ({
  status,
}: EvaluationStatusBadgeProps) => {
  const statusConfig = {
    draft: {
      text: "مسودة",
      className: "bg-gray-100 text-gray-700",
    },
    submitted: {
      text: "تم الإرسال",
      className: "bg-blue-100 text-blue-700",
    },
    approved: {
      text: "معتمد",
      className: "bg-green-100 text-green-700",
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.text}
    </span>
  );
};
