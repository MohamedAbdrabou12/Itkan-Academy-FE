import { useController, useFormContext } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface HookFormSingleSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export default function HookFormSingleSelect<T extends FieldValues>({
  name,
  label,
  required = false,
  options,
  placeholder = "اختر...",
  disabled = false,
}: HookFormSingleSelectProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field,
    fieldState: { error },
  } = useController<T, Path<T>>({ name, control });

  const finalError = error?.message;

  return (
    <div className="mb-4 w-full">
      <label
        htmlFor={name as string}
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
          id={name as string}
          {...field}
          disabled={disabled}
          className="w-full bg-transparent text-gray-800 outline-none disabled:opacity-60"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {finalError && (
        <p className="mt-1 text-sm text-red-600">{finalError}</p>
      )}
    </div>
  );
}
