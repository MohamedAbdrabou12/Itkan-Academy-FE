import type { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  value: string | string[];
  onChange: (value: string | string[]) => void;
  onBlur: () => void;
  error?: string;
  options: SelectOption[];
  multiple?: boolean;
  icon?: ReactNode;
}

export const FormSelect = ({
  name,
  label,
  required = false,
  value,
  onChange,
  onBlur,
  error,
  options,
  multiple = false,
  icon,
}: FormSelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (multiple) {
      const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
      onChange(selected);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-gray-50
        ${error ? "border-red-400" : "border-gray-300"}
        focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-300
        transition`}
      >
        {icon && <span className="text-emerald-600">{icon}</span>}

        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          multiple={multiple}
          className="w-full bg-transparent outline-none text-gray-800"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};