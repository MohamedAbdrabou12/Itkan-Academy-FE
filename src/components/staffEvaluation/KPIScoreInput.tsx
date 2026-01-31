import { StarIcon } from "lucide-react";

interface KPIScoreInputProps {
  score: number;
  maxScore: number;
  onChange: (score: number) => void;
  readOnly?: boolean;
}

export const KPIScoreInput = ({
  score,
  maxScore,
  onChange,
  readOnly = false,
}: KPIScoreInputProps) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxScore }).map((_, index) => {
        const ratingValue = index + 1;
        const isFilled = ratingValue <= score;
        return (
          <button
            key={index}
            type="button"
            className={`${readOnly ? "cursor-default" : "cursor-pointer"} p-0.5 focus:outline-none`}
            onClick={() => !readOnly && onChange(ratingValue)}
            disabled={readOnly}
          >
            <StarIcon
              className={`h-6 w-6 ${isFilled ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-400"}`}
            />
          </button>
        );
      })}
      <span className="mr-2 text-sm font-medium text-gray-500">
        {score} / {maxScore}
      </span>
    </div>
  );
};
