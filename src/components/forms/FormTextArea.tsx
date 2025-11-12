interface FormTextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error?: string;
  rows?: number;
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
}: FormTextAreaProps) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1">
        <textarea
          name={name}
          id={name}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`block w-full rounded-md border ${
            error ? "border-red-300" : "border-gray-300"
          } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
