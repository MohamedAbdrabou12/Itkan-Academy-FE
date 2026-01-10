import clsx from "clsx";
import { useController, useFormContext } from "react-hook-form";

interface HookFormTextAreaProps {
  name: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  customTextAreaProps?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
  containerClassName?: string;
}

export default function HookFormTextArea({
  name,
  label,
  required = false,
  placeholder,
  disabled = false,
  icon,
  customTextAreaProps,
  containerClassName,
}: HookFormTextAreaProps) {
  const { control } = useFormContext();
  const { field, fieldState } = useController({
    name,
    control,
  });
  const finalError = fieldState.error?.message;

  return (
    <div className={clsx("mb-4 w-full", containerClassName)}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        className={`flex items-center gap-2 rounded-xl border bg-gray-50 px-3 py-2 
        ${finalError ? "border-red-400" : "border-gray-300"}
        transition focus-within:border-emerald-600 focus-within:ring-2
        focus-within:ring-emerald-300`}
      >
        {icon && <span className="text-indigo-600">{icon}</span>}

        <textarea
          {...field}
          {...customTextAreaProps}
          id={name}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full bg-transparent text-gray-800 outline-none disabled:opacity-60"
        />
      </div>

      {finalError && (
        <p className="mt-1 text-xs font-medium text-red-600">{finalError}</p>
      )}
    </div>
  );
}
