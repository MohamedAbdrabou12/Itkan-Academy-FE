import type { FormComponents, FormField } from "@/types/Forms";
import { roleSchema, type RoleFormData } from "@/validation/roleSchema";
import { FormInput } from "../forms/FormInput";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RoleFormData) => Promise<void>;
  initialData?: RoleFormData;
  isSubmitting?: boolean;
  isEditing?: boolean;
  closeOnBackdropClick?: boolean;
}

export const RoleFormModal = (props: RoleFormModalProps) => (
  <GenericFormModal
    {...props}
    schema={roleSchema}
    fields={roleFields}
    title={props.isEditing ? "تعديل الوظيفة" : "إضافة وظيفة جديدة"}
    description={
      props.isEditing
        ? "قم بتحديث بيانات الوظيفة أدناه."
        : "املأ البيانات لإنشاء وظيفة جديدة."
    }
    submitButtonText="إنشاء الوظيفة"
    editingSubmitButtonText="تحديث الوظيفة"
    formComponents={formComponents}
  />
);

const roleFields: FormField[] = [
  {
    name: "name",
    label: "الاسم بالإنجليزية",
    type: "text",
    required: true,
    placeholder: "أدخل الاسم بالإنجليزية",
  },
  {
    name: "name_ar",
    label: "الاسم بالعربية",
    type: "text",
    required: true,
    placeholder: "أدخل الاسم بالعربية",
  },
  {
    name: "description",
    label: "الوصف",
    type: "textarea",
    required: false,
    placeholder: "ادخل وصف الوظيفة هنا...",
    rows: 3,
  },
  {
    name: "description_ar",
    label: "الوصف بالعربية",
    type: "textarea",
    required: false,
    placeholder: "ادخل وصف الوظيفة هنا...",
    rows: 3,
  },
];

const formComponents: FormComponents = {
  Input: FormInput,
  TextArea: FormTextArea,
  Select: FormSelect,
};
