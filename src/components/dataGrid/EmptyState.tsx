import type { EmptyStateProps } from "@/types/dataGrid";

const EmptyState: React.FC<EmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  entityName,
}) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
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
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>

      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        لا توجد {entityName}
      </h3>

      <p className="mb-6 max-w-md text-gray-500">
        {hasFilters
          ? "لا توجد نتائج تطابق عوامل التصفية الحالية. حاول تعديل معايير البحث أو امسح عوامل التصفية لرؤية جميع العناصر."
          : `ابدأ بإنشاء ${entityName.toLowerCase()} الأول الخاص بك.`}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        {hasFilters ? (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
            مسح جميع عوامل التصفية
          </button>
        ) : (
          <div className="text-sm text-gray-400">
            لا توجد {entityName.toLowerCase()} في النظام بعد.
          </div>
        )}
      </div>

      {hasFilters && (
        <div className="mt-6 max-w-sm text-xs text-gray-500 text-right">
          <p className="font-medium mb-1">نصائح للحصول على نتائج أفضل:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>تحقق من الأخطاء الإملائية في البحث</li>
            <li>استخدم مصطلحات بحث أكثر عمومية</li>
            <li>قم بإزالة بعض عوامل التصفية لتوسيع نطاق البحث</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmptyState;







// import type { EmptyStateProps } from "@/types/dataGrid";

// const EmptyState: React.FC<EmptyStateProps> = ({
//   hasFilters,
//   onClearFilters,
//   entityName,
// }) => {
//   return (
//     <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
//       <div className="mx-auto mb-4 h-24 w-24 text-gray-300">
//         <svg
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={1}
//             d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//           />
//         </svg>
//       </div>

//       <h3 className="mb-2 text-lg font-medium text-gray-900">
//         لا توجد {entityName}
//       </h3>

//       <p className="mb-6 max-w-md text-gray-500">
//         {hasFilters
//           ? "لا توجد نتائج تطابق عوامل التصفية الحالية. حاول تعديل معايير البحث أو امسح عوامل التصفية لرؤية جميع العناصر."
//           : `ابدأ بإنشاء ${entityName.toLowerCase()} الأول الخاص بك.`}
//       </p>

//       <div className="flex flex-col gap-3 sm:flex-row">
//         {hasFilters ? (
//           <>
//             <button
//               onClick={onClearFilters}
//               className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               <svg
//                 className="mr-2 h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//                 />
//               </svg>
//               مسح جميع عوامل التصفية
//             </button>
//           </>
//         ) : (
//           <div className="text-sm text-gray-500">
//             لا توجد {entityName.toLowerCase()} في النظام بعد.
//           </div>
//         )}
//       </div>

//       {hasFilters && (
//         <div className="mt-6 max-w-sm text-xs text-gray-400">
//           <p>جرب هذه النصائح للحصول على نتائج أفضل:</p>
//           <ul className="mt-1 list-inside list-disc space-y-1 text-right">
//             <li>تحقق من الأخطاء الإملائية في البحث</li>
//             <li>استخدم مصطلحات بحث أكثر عمومية</li>
//             <li>قم بإزالة بعض عوامل التصفية لتوسيع نطاق البحث</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EmptyState;
