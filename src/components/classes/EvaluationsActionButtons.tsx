import { Save, X } from "lucide-react";

interface ActionButtonsProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const EvaluationsActionButtons = ({
  onSubmit,
  onCancel,
}: ActionButtonsProps) => {
  return (
    <div className="mt-6 flex justify-end space-x-3">
      <button
        onClick={onCancel}
        className="flex cursor-pointer items-center space-x-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <X className="h-4 w-4" />
        <span>إلغاء</span>
      </button>
      <button
        onClick={onSubmit}
        className="flex cursor-pointer items-center space-x-2 rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
      >
        <Save className="h-4 w-4" />
        <span>حفظ التقييمات</span>
      </button>
    </div>
  );
};

export default EvaluationsActionButtons;
