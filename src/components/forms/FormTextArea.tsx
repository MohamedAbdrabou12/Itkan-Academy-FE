import { useFormContext } from "react-hook-form";

interface FormTextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export const FormTextArea = ({
  name,
  label,
  required = false,
  placeholder,
  rows = 3,
  disabled = false,
}: FormTextAreaProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        {...register(name)}
        id={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-300 focus:border-blue-500"
        } ${disabled ? "cursor-not-allowed bg-gray-100" : ""}`}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
};
