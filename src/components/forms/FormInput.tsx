import { useFormContext } from "react-hook-form";

interface FormInputProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
}

export const FormInput = ({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  disabled = false,
  value,
}: FormInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        {...register(name)}
        type={type}
        id={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        className={`block w-full rounded-lg border px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
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
