import type { Column, GridTableProps } from "@/types/dataGrid";
import ActionMenu from "./ActionMenu";

const GridTable = <T extends Record<string, unknown>>({
  data,
  columns,
  sortInfo,
  onSort,
  onEdit,
  onDelete,
  onView,
}: GridTableProps<T>) => {
  const hasActions = onEdit || onDelete || onView;

  const renderCell = (column: Column<T>, row: T) => {
    if (column.render) {
      const cellValue = row[column.key as keyof T];
      return column.render(cellValue, row);
    }

    const value = row[column.key as keyof T];
    return value != null ? String(value) : "-";
  };

  const SortArrow = ({
    isActive,
    direction,
  }: {
    isActive: boolean;
    direction: "asc" | "desc";
  }) => (
    <svg
      className={`h-4 w-4 transition-transform duration-200 ${
        isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
      } ${direction === "desc" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M7 11l5-5m0 0l5 5m-5-5v12"
      />
    </svg>
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => {
              const isSorted = sortInfo.sortBy === column.key;
              const isSortable = column.sortable === true;

              return (
                <th
                  key={String(column.key)}
                  className="bg-gray-100 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase"
                  style={{ width: column.width }}
                >
                  {isSortable ? (
                    <button
                      onClick={() => onSort(String(column.key))}
                      className="group flex w-full items-center space-x-2 text-left hover:text-gray-900"
                    >
                      <span className="font-semibold">{column.title}</span>
                      <div className="flex items-center">
                        <SortArrow
                          isActive={isSorted}
                          direction={isSorted ? sortInfo.sortOrder : "asc"}
                        />
                        {isSorted && (
                          <span className="ml-1 text-xs font-normal text-blue-600">
                            {sortInfo.sortOrder === "asc" ? "A-Z" : "Z-A"}
                          </span>
                        )}
                      </div>
                    </button>
                  ) : (
                    // Non-sortable column - just display the title
                    <span className="font-semibold text-gray-600">
                      {column.title}
                    </span>
                  )}
                </th>
              );
            })}
            {hasActions && (
              <th className="bg-gray-100 px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-700 uppercase">
                <span className="font-semibold text-gray-600">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((row, index) => (
            <tr key={index} className="transition-colors hover:bg-gray-50">
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  style={{
                    maxWidth: column.width || "200px",
                    width: column.width,
                  }}
                  className="truncate px-6 py-4 text-sm whitespace-nowrap text-gray-900"
                >
                  {renderCell(column, row)}
                </td>
              ))}
              {hasActions && (
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <ActionMenu
                    item={row}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onView={onView}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GridTable;
