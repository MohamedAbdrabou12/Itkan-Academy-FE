import type { ReactNode } from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
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
    onChange(e.target.value);
  };

  return (
    <div className="w-full">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2
        ${error ? "border-red-400" : "border-gray-300"}
        transition focus-within:border-emerald-600 focus-within:ring-2
        focus-within:ring-emerald-300`}
      >
        {icon && <span className="text-emerald-600">{icon}</span>}

        <select
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          multiple={multiple}
          className="w-full bg-transparent text-gray-800 outline-none"
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
