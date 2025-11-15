interface FormInputProps {
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
}: FormInputProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <input
          type={type}
          name={name}
          id={name}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={`block w-full rounded-md border ${
            error ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-70`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
