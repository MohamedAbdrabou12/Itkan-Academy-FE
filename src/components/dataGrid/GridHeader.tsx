import { Plus } from "lucide-react";

interface GridHeaderProps {
  title: string;
  onAddNew?: () => void;
  addButtonText: string;
}

const GridHeader = ({ title, onAddNew, addButtonText }: GridHeaderProps) => (
  <div className="border-b border-gray-200 px-6 py-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {onAddNew && (
        <button
          onClick={onAddNew}
          className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          <span><Plus /></span>
          <span>{addButtonText}</span>
        </button>
      )}
    </div>
  </div>
);

export default GridHeader;
