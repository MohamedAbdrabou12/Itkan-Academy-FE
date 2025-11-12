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
}: FormSelectProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <select
          name={name}
          id={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={`block w-full rounded-md border ${
            error ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
