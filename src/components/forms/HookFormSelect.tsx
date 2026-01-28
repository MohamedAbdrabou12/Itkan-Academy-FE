import { useState, useRef, useEffect } from "react";
import { useController, useFormContext } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

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
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  enableSearch?: boolean;
  className?: string;
}

export default function HookFormSelect({
  name,
  label,
  required = false,
  options,
  placeholder,
  disabled = false,
  onChange = () => {},
  onSearch,
  enableSearch = false,
  className,
}: HookFormSelectProps) {
  const { control } = useFormContext();
  const {
    field,
    fieldState: { error },
  } = useController({ name, control });

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearch) {
      onSearch(e.target.value);
    } else {
      setSearchTerm(e.target.value);
    }
  };

  return (
    <div className={clsx("mb-6 w-full", className)} ref={ref}>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-semibold text-gray-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <div
          className={clsx(
            "flex w-full items-center rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-gray-700 transition hover:border-emerald-600",
            { "border-red-400": finalError },
            { "cursor-not-allowed bg-gray-100 opacity-70": disabled },
          )}
          onClick={() => !disabled && setOpen((prev) => !prev)}
        >
          <span className="w-full select-none text-gray-800">
            {options.find((o) => o.value === field.value)?.label ||
              placeholder ||
              "اختر..."}
          </span>

          <ChevronDown className="h-5 w-5 text-emerald-600" />
        </div>

        {open && (
          <div className="absolute left-0 top-full z-50 mt-2 w-full rounded-xl border border-emerald-300 bg-white shadow-lg">
            {enableSearch && (
              <div className="p-2">
                <input
                  type="text"
                  placeholder="بحث..."
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-emerald-500 focus:outline-none"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            )}
            {(enableSearch ? filteredOptions : options).map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  field.onChange(opt.value);
                  setOpen(false);
                  onChange(opt.value);
                  setSearchTerm(""); // Reset search term on select
                }}
                className={`cursor-pointer px-3 py-2 text-sm transition
                ${
                  field.value === opt.value
                    ? "bg-emerald-100 font-medium text-emerald-700"
                    : "text-gray-800 hover:bg-emerald-50"
                }`}
              >
                {opt.label}
              </div>
            ))}
            {filteredOptions.length === 0 && enableSearch && (
              <div className="px-3 py-2 text-sm text-gray-500">
                لا توجد نتائج
              </div>
            )}
          </div>
        )}
      </div>

      {finalError && <p className="mt-1 text-sm text-red-600">{finalError}</p>}
    </div>
  );
}
