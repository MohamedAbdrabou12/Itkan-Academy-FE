import { Check, ChevronDown, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useController, useFormContext, useWatch } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface HookFormMultiSelectProps {
  name: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  dir?: "ltr" | "rtl";
}

export default function HookFormMultiSelect({
  name,
  label,
  options,
  placeholder = "Select one or more options...",
  required,
  disabled = false,
  dir = "rtl",
}: HookFormMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { register, setValue, control } = useFormContext();

  // Use useController to get error and field properties
  const {
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const value: string[] =
    useWatch({
      name,
      control: control,
    }) || [];

  const { onBlur, ref } = register(name, {
    validate: {
      requiredSelection: (currentValue) => {
        if (required && (!currentValue || currentValue.length === 0)) {
          return `${label} selection is required.`;
        }
        return true;
      },
    },
  });

  // Extract error message
  const finalError = error?.message;

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  // Handler for adding/removing an item from the value array
  const handleSelect = useCallback(
    (optionValue: string) => {
      if (disabled) return;

      // Determine the new value array
      const isSelected = value.includes(optionValue);
      const newValue = isSelected
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];

      // Update RHF state manually using setValue
      setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
    },
    [disabled, value, name, setValue],
  );

  // Handler for removing a chip
  const handleRemove = useCallback(
    (optionValue: string) => {
      if (disabled) return;
      const newValue = value.filter((v) => v !== optionValue);

      // Update RHF state manually
      setValue(name, newValue, { shouldValidate: true, shouldDirty: true });
    },
    [disabled, value, name, setValue],
  );

  // Handle clicking outside the component
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onBlur(event);
      }
    },
    [onBlur],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );

  // Styling helpers
  const baseInputClasses = `
    w-full flex items-center justify-between
    bg-white  border rounded-xl shadow-sm transition
    h-auto min-h-12 py-2 px-3
    ${disabled ? "bg-gray-100  cursor-not-allowed opacity-70" : "cursor-pointer"}
    ${finalError ? "border-red-500 ring-2 ring-red-200" : "border-gray-300"}
  `;

  const chipClasses = `
    inline-flex items-center space-x-1 px-2 py-0.5 text-sm font-medium 
    bg-emerald-100 text-emerald-800 rounded-full
  `;

  return (
    <div className="form-control mb-6 w-full" dir={dir} ref={containerRef}>
      <label
        htmlFor={name}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="relative">
        {/* Input/Display area */}
        <div
          ref={ref}
          className={baseInputClasses}
          onClick={handleToggle}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleToggle();
            }
          }}
        >
          <div className="flex min-h-6 flex-wrap items-center gap-2">
            {selectedOptions.length > 0 ? (
              selectedOptions.map((option) => (
                <div key={option.value} className={chipClasses}>
                  <span>{option.label}</span>
                  <button
                    type="button"
                    className="hover:bg-emerald-200-700 rounded-full p-0.5 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(option.value);
                    }}
                    disabled={disabled}
                    aria-label={`Remove ${option.label}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          {/* Dropdown Icon */}
          <ChevronDown
            className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition-transform
              ${dir === "rtl" ? "left-3" : "right-3"} 
              ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
            {options.length > 0 ? (
              options.map((option) => {
                const isChecked = value.includes(option.value);
                return (
                  <li key={option.value}>
                    <a
                      onClick={(e) => {
                        e.preventDefault();
                        handleSelect(option.value);
                      }}
                      className={`hover:bg-gray-100-700 flex cursor-pointer items-center justify-between px-4 py-2 text-gray-700 
                                    transition 
                                    ${isChecked ? "bg-gray-50 font-semibold" : ""}`}
                    >
                      {option.label}
                      {isChecked && (
                        <Check className="h-4 w-4 text-emerald-600" />
                      )}
                    </a>
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-2 text-sm italic text-gray-500">
                لا توجد خيارات متاحة
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Error Message */}
      {finalError && (
        <p className="mt-1 flex items-center text-sm text-red-600">
          {finalError}
        </p>
      )}
    </div>
  );
}
