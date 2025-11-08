export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "textarea" | "select" | "phone" | "password";
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  dir?: "ltr" | "rtl";
  rows?: number;
}

export interface FormComponents {
  Input: React.ComponentType<{
    name: string;
    label: string;
    type?: string;
    required?: boolean;
    placeholder?: string;
    dir?: "ltr" | "rtl";
  }>;
  TextArea: React.ComponentType<{
    name: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    rows?: number;
  }>;
  Select: React.ComponentType<{
    name: string;
    label: string;
    required?: boolean;
    options: { value: string; label: string }[];
  }>;
}
