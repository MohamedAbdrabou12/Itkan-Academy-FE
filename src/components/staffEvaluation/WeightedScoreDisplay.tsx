interface WeightedScoreDisplayProps {
  score?: number;
  className?: string;
}

export const WeightedScoreDisplay = ({
  score,
  className = "",
}: WeightedScoreDisplayProps) => {
  if (score === undefined || score === null) return <span>-</span>;

  let colorClass = "text-gray-700";
  if (score >= 90) colorClass = "text-green-600";
  else if (score >= 80) colorClass = "text-blue-600";
  else if (score >= 70) colorClass = "text-yellow-600";
  else colorClass = "text-red-600";

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <span className={`text-2xl font-bold ${colorClass}`}>{score}%</span>
      <span className="text-sm text-gray-500">الدرجة النهائية</span>
    </div>
  );
};
