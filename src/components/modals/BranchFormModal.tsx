import type { FormComponents, FormField } from "@/types/Forms";
import { branchSchema, type BranchFormData } from "@/validation/branchSchema";
import { FormInput } from "lucide-react";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BranchFormData) => Promise<void>;
  initialData?: BranchFormData;
  isSubmitting?: boolean;
  isEditing?: boolean;
  closeOnBackdropClick?: boolean;
}

export const BranchFormModal = (props: BranchFormModalProps) => (
  <GenericFormModal
    {...props}
    schema={branchSchema}
    fields={branchFields}
    title={props.isEditing ? "تعديل الفرع" : "إضافة فرع جديد"}
    description={
      props.isEditing
        ? "قم بتحديث بيانات الفرع أدناه."
        : "املأ البيانات لإنشاء فرع جديد."
    }
    submitButtonText="إنشاء الفرع"
    editingSubmitButtonText="تحديث الفرع"
    formComponents={formComponents}
  />
);

const branchFields: FormField[] = [
  {
    name: "name",
    label: "اسم الفرع",
    type: "text",
    required: true,
    placeholder: "أدخل اسم الفرع",
  },
  {
    name: "email",
    label: "البريد الإلكتروني",
    type: "email",
    required: true,
    placeholder: "أدخل البريد الإلكتروني للفرع",
  },
  {
    name: "phone",
    label: "الهاتف",
    type: "phone",
    dir: "ltr",
  },
  {
    name: "address",
    label: "العنوان",
    type: "textarea",
    placeholder: "أدخل عنوان الفرع...",
    rows: 3,
  },
  {
    name: "status",
    label: "الحالة",
    type: "select",
    required: true,
    options: [
      { value: "active", label: "نشط" },
      { value: "deactive", label: "غير نشط" },
    ],
  },
];

const formComponents: FormComponents = {
  Input: FormInput,
  TextArea: FormTextArea,
  Select: FormSelect,
};
