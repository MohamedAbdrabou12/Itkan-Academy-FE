import type { EmptyStateProps } from "@/types/dataGrid";

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  entityName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      {/* Icon */}
      <div className="mx-auto mb-4 h-24 w-24 text-gray-300">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-medium text-gray-900">
        No {entityName} found
      </h3>

      {/* Description */}
      <p className="mb-6 max-w-md text-gray-500">
        {hasFilters
          ? "No results match your current filters. Try adjusting your search criteria or clear the filters to see all items."
          : `Get started by creating your first ${entityName.toLowerCase()}.`}
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {hasFilters ? (
          <>
            <button
              onClick={onClearFilters}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Clear all filters
            </button>
          </>
        ) : (
          <div className="text-sm text-gray-500">
            There are no {entityName.toLowerCase()} in the system yet.
          </div>
        )}
      </div>

      {/* Additional Help Text for Filtered State */}
      {hasFilters && (
        <div className="mt-6 max-w-sm text-xs text-gray-400">
          <p>Try these tips to get better results:</p>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Check for typos in your search</li>
            <li>Use more general search terms</li>
            <li>Remove some filters to broaden your search</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
