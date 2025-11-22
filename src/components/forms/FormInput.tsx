import type { ReactNode } from "react";
export interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  dir?: "ltr" | "rtl";
  disabled?: boolean;
  icon?: ReactNode;
  hideRequiredIndicator?: boolean;
}

export const FormInput = ({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  dir = "rtl",
  disabled = false,
  icon,
  hideRequiredIndicator = false,
}: FormInputProps) => {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {!hideRequiredIndicator && required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 bg-gray-50 
        ${error ? "border-red-400" : "border-gray-300"}
        focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-300
        transition`}
      >
        {icon && <span className="text-emerald-600">{icon}</span>}

        <input
          type={type}
          id={name}
          name={name}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent outline-none text-gray-800 disabled:opacity-60"
        />
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};