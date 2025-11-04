import type { GridErrorProps } from "@/types/dataGrid";

const GridError = ({ message, onRetry }: GridErrorProps) => (
  <div className="p-8 text-center">
    <div className="inline-block rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
      <svg
        className="mx-auto mb-2 h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="font-medium">Error loading data</p>
      <p className="mt-1 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

export default GridError;
