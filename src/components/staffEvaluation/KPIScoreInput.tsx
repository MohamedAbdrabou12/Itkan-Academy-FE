interface KPIScoreInputProps {
  score: number;
  maxScore: number;
  weight: number;
  onChange: (score: number) => void;
  readOnly?: boolean;
  error?: string;
}

export const KPIScoreInput = ({
  score,
  maxScore,
  weight,
  onChange,
  readOnly = false,
  error,
}: KPIScoreInputProps) => {
  // Calculate the weighted percentage contribution
  const percentage =
    maxScore > 0 ? ((score / maxScore) * weight).toFixed(1) : "0.0";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="number"
            min="0"
            max={maxScore}
            step="0.5"
            value={score}
            onChange={(e) => {
              const val = parseFloat(e.target.value) || 0;
              onChange(Math.min(Math.max(0, val), maxScore));
            }}
            disabled={readOnly}
            className={`input input-bordered w-20 text-center text-lg font-semibold ${
              error ? "input-error" : ""
            } ${readOnly ? "bg-gray-50" : ""}`}
          />
        </div>
        <span className="text-gray-500">/</span>
        <span className="text-lg font-medium text-gray-700">{maxScore}</span>
        <div className="bg-primary/10 mr-4 flex items-center gap-2 rounded-lg px-3 py-1">
          <span className="text-sm text-gray-600">المساهمة:</span>
          <span className="text-primary text-sm font-bold">{percentage}%</span>
          <span className="text-xs text-gray-400">من {weight}%</span>
        </div>
      </div>
      {error && <span className="text-error text-xs">{error}</span>}
    </div>
  );
};
