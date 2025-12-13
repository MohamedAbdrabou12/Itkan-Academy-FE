import { useState, useRef, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";

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
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const finalError = error?.message;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="mb-6 w-full" ref={ref}>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`relative flex items-center rounded-xl border bg-gray-50 px-3 py-2 cursor-pointer
        ${finalError ? "border-red-400" : "border-gray-300"}
        transition hover:border-emerald-600`}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className="w-full text-gray-800 select-none">
          {options.find((o) => o.value === field.value)?.label ||
            placeholder ||
            "اختر..."}
        </span>

        <ChevronDown className="w-5 h-5 text-emerald-600" />

        {open && (
          <div className="absolute left-0 top-full mt-2 w-full rounded-xl border border-emerald-300 bg-white shadow-lg z-50">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  field.onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer transition text-sm
                ${
                  field.value === opt.value
                    ? "bg-emerald-100 text-emerald-700 font-medium"
                    : "hover:bg-emerald-50 text-gray-800"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {finalError && (
        <p className="mt-1 text-sm text-red-600">{finalError}</p>
      )}
    </div>
  );
}
