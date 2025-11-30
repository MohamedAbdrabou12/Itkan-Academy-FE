import { useController, useFormContext } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}
interface HookFormSelectProps {
  name: string;
  label: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function HookFormSelect({
  name,
  label,
  required = false,
  options,
  placeholder,
  disabled = false,
}: HookFormSelectProps) {
  const { control, formState } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });
  const finalError = error?.message;
  const isSubmitted = formState.isSubmitted;

  return (
    <div className="mb-6 w-full">
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2
        ${finalError ? "border-red-400" : "border-gray-300"}
        transition focus-within:border-emerald-600 focus-within:ring-2
        focus-within:ring-emerald-300`}
      >
        <select
          id={name}
          {...field}
          disabled={disabled}
          className="w-full bg-transparent text-gray-800 outline-none disabled:opacity-60"
        >
          <option value="" disabled>
            {placeholder || "اختر..."}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {finalError && isSubmitted && (
        <p className="mt-1 flex items-center text-sm text-red-600 dark:text-red-400">
          {finalError}
        </p>
      )}
    </div>
  );
}