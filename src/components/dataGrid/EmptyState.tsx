import type { EmptyStateProps } from "@/types/dataGrid";
import { Frown, FilterX } from "lucide-react";

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  entityName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400 shadow-inner">
        <Frown className="h-14 w-14" />
      </div>

      <h3 className="mb-2 text-xl font-semibold text-gray-900">
        لا توجد {entityName}
      </h3>

      <p className="mb-8 max-w-md text-gray-500 leading-relaxed">
        {hasFilters
          ? "لا توجد نتائج تطابق عوامل التصفية الحالية. حاول تعديل معايير البحث أو مسح عوامل التصفية لرؤية جميع العناصر."
          : `ابدأ بإنشاء ${entityName.toLowerCase()} الأول الخاص بك.`}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {hasFilters ? (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg active:scale-95"
          >
            <FilterX className="h-4 w-4" />
            مسح جميع عوامل التصفية
          </button>
        ) : (
          <div className="text-sm text-gray-500">
            لا توجد {entityName.toLowerCase()} في النظام بعد.
          </div>
        )}
      </div>

      {hasFilters && (
        <div className="mt-8 max-w-sm text-xs text-gray-400">
          <p className="font-medium">نصائح للحصول على نتائج أفضل:</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-right leading-relaxed">
            <li>تحقق من الأخطاء الإملائية في البحث</li>
            <li>استخدم مصطلحات بحث أكثر عمومية</li>
            <li>قم بإزالة بعض عوامل التصفية لتوسيع نطاق النتائج</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;