import type { PaginationControlsProps } from "@/types/dataGrid";

const PaginationControls: React.FC<PaginationControlsProps> = ({
  pagination,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
}) => {
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total,
  );

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (pagination.totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= pagination.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let start = Math.max(2, pagination.page - 1);
      let end = Math.min(pagination.totalPages - 1, pagination.page + 1);

      // Adjust if we're at the beginning
      if (pagination.page <= 2) {
        end = 4;
      }

      // Adjust if we're at the end
      if (pagination.page >= pagination.totalPages - 1) {
        start = pagination.totalPages - 3;
      }

      // Add ellipsis after first page if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (end < pagination.totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(pagination.totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4">
      {/* Left side - Page info and page size selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
        <div className="mb-2 text-sm text-gray-700 sm:mb-0">
          عرض <span className="font-medium">{startItem}</span> إلى{" "}
          <span className="font-medium">{endItem}</span> من{" "}
          <span className="font-medium">{pagination.total}</span> نتيجة
        </div>

        <div className="flex items-center space-x-2">
          <label htmlFor="page-size" className="text-sm text-gray-700">
            عرض:
          </label>
          <select
            id="page-size"
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side - Page navigation */}
      <div className="flex items-center space-x-2">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          السابق
        </button>

        {/* Page numbers */}
        <div className="hidden space-x-1 sm:flex">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === "number" && onPageChange(page)}
              disabled={page === "..."}
              className={`relative inline-flex items-center border px-3 py-2 text-sm font-medium transition-colors ${
                page === pagination.page
                  ? "z-10 border-blue-500 bg-blue-50 text-blue-600"
                  : page === "..."
                    ? "cursor-default border-transparent text-gray-500"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Mobile page info */}
        <div className="text-sm text-gray-700 sm:hidden">
          صفحة {pagination.page} من {pagination.totalPages}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
