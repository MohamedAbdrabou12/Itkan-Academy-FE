import type { EmptyStateProps } from "@/types/dataGrid";
import { Frown } from "lucide-react";

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  children,
  entityName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400 shadow-inner">
        <Frown className="h-14 w-14" />
      </div>

      <h3 className="mb-4 text-lg font-medium text-gray-900">
        لا يوجد {entityName}
      </h3>

      <p className="mb-4 max-w-md text-gray-500">
        {hasFilters &&
          "لا يوجد نتائج تطابق عوامل التصفية الحالية. حاول تعديل معايير البحث أو امسح عوامل التصفية لرؤية جميع العناصر."}
      </p>

      {children}
    </div>
  );
};

export default EmptyState;
