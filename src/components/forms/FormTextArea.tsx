import type { ReactNode } from "react";

export interface FormTextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  rows?: number;
  icon?: ReactNode; 
}

export const FormTextArea = ({
  name,
  label,
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  rows = 3,
  icon,
}: FormTextAreaProps) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex items-start gap-2 rounded-xl border px-3 py-2 bg-gray-50
        ${error ? "border-red-400" : "border-gray-300"}
        focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-300
        transition`}
      >
        {icon && <span className="mt-1 text-emerald-600">{icon}</span>}

        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className="w-full bg-transparent outline-none text-gray-800 resize-none"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};