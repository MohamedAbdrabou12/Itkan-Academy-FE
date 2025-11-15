export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "phone" | "password";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  dir?: "ltr" | "rtl";
  rows?: number;
  disabled?: boolean;
}

export interface FormComponents {
  Input: React.ComponentType<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    error?: string;
    dir?: "ltr" | "rtl";
  }>;
  TextArea: React.ComponentType<{
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    error?: string;
    rows?: number;
  }>;
  Select: React.ComponentType<{
    name: string;
    label: string;
    required?: boolean;
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    error?: string;
    options: Array<{ value: string; label: string }>;
  }>;
}
