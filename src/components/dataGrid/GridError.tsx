import type { GridErrorProps } from "@/types/dataGrid";
import { AlertTriangle } from "lucide-react";

const GridError = ({ message, onRetry }: GridErrorProps) => (
  <div className="flex items-center justify-center px-6 py-12 text-center">
    <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50/60 p-6 shadow-sm backdrop-blur-sm">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h3 className="text-lg font-semibold text-red-700">
        خطأ في تحميل البيانات
      </h3>

      <p className="mt-2 text-sm text-red-600/90 leading-relaxed">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white shadow transition-all hover:bg-red-700 hover:shadow-md active:scale-95"
        >
          حاول مرة أخرى
        </button>
      )}
    </div>
  </div>
);

export default GridError;