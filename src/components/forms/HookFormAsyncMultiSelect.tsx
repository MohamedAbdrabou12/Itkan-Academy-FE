import { useEffect, useState, useMemo } from "react";
import type { FieldValues, Path } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";
import apiReq from "@/services/apiReq";
import { X } from "lucide-react";

export interface AsyncMultiSelectOption {
  id: number;
  label: string;
  email?: string | null;
}

interface HookFormAsyncMultiSelectProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  fetchUrl: string;
}

export default function HookFormAsyncMultiSelect<T extends FieldValues>({
  name,
  label,
  placeholder = "",
  fetchUrl,
}: HookFormAsyncMultiSelectProps<T>) {
  const { control } = useFormContext<T>();
  const {
    field: { value, onChange },
  } = useController<T, Path<T>>({ name, control });

  // تأكدنا إن القيمة مصفوفة من نوع AsyncMultiSelectOption
  const typedValue: AsyncMultiSelectOption[] = useMemo(
    () => (Array.isArray(value) ? (value as AsyncMultiSelectOption[]) : []),
    [value]
  );

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<AsyncMultiSelectOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = (await apiReq("GET", `${fetchUrl}?search=${encodeURIComponent(query)}&size=10`)) as {
          items: AsyncMultiSelectOption[];
        };
        if (!cancelled)
          setSuggestions(res.items.filter((item) => !typedValue.some((v) => v.id === item.id)));
      } catch {
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, typedValue, fetchUrl]);

  const suggestionsList = useMemo(() => suggestions.slice(0, 10), [suggestions]);

  const addItem = (item: AsyncMultiSelectOption) => {
    onChange([...typedValue, item]);
    setQuery("");
    setSuggestions([]);
  };

  const removeItem = (id: number) => {
    onChange(typedValue.filter((v) => v.id !== id));
  };

  return (
    <div className="col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {typedValue.map((v) => (
          <div
            key={v.id}
            className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md border"
          >
            <span className="text-sm">{v.label}</span>
            <button
              type="button"
              onClick={() => removeItem(v.id)}
              className="text-xs text-red-600"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-gray-300 shadow-sm p-2 focus:border-emerald-600 focus:ring focus:ring-emerald-100"
      />
      {loading && <div className="text-sm text-gray-500 mt-1">جارٍ البحث...</div>}
      {!loading && query && suggestionsList.length > 0 && (
        <div className="mt-1 max-h-48 overflow-auto rounded-md border bg-white shadow">
          {suggestionsList.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => addItem(s)}
              className="w-full text-left px-3 py-2 hover:bg-gray-50"
            >
              <div className="text-sm font-medium">{s.label}</div>
              {s.email && <div className="text-xs text-gray-500">{s.email}</div>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}