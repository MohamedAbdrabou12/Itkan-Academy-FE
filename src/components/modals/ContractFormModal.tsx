import useGetAllEmployees from "@/hooks/employees/useGetAllEmployees";
import type { FormComponents, FormField } from "@/types/Forms";
import {
  contractSchema,
  type ContractFormData,
} from "@/validation/contractSchema";
import { useMemo } from "react";
import { FormInput } from "../forms/FormInput";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContractFormData) => Promise<void>;
  initialData?: ContractFormData;
  isSubmitting?: boolean;
  isEditing?: boolean;
  closeOnBackdropClick?: boolean;
}

const ContractFormModal = ((props: ContractFormModalProps) => {
  const initialData: ContractFormData = props.initialData ?? {
    employee_id: "",
    allowance: "",
    base_salary: "",
    effective_from: new Date().toDateString(),
    effective_to: "",
  };

  const { employees } = useGetAllEmployees();
  const contractFields = useMemo(
    () =>
      [
        {
          name: "employee_id",
          label: "الموظف",
          type: "select",
          required: true,
          options: employees?.map((employee) => ({
            value: employee.id.toString(),
            label: `${employee.full_name} (${employee.role_name_ar})`,
          })),
        },
        {
          name: "base_salary",
          label: "المرتب الأساسى",
          type: "number",
          required: true,
          placeholder: "0.00",
        },
        {
          name: "allowance",
          label: "بدلات",
          type: "number",
          required: true,
          placeholder: "0.00",
        },
        {
          name: "effective_from",
          label: "مفعل من",
          type: "date",
          required: true,
        },
        {
          name: "effective_to",
          label: "مفعل إلى",
          type: "date",
          required: true,
        },
      ] satisfies FormField[],
    [employees],
  );

  const formComponents = {
    Input: FormInput,
    TextArea: FormTextArea,
    Select: FormSelect,
  } satisfies FormComponents;

  return (
    <GenericFormModal
      {...props}
      schema={contractSchema}
      fields={contractFields}
      title={props.isEditing ? "تعديل العقد" : "تسجيل عقد جديد"}
      description={
        props.isEditing
          ? "قم بتحديث بيانات العقد أدناه."
          : "املأ البيانات لتسجيل عقد جديد"
      }
      submitButtonText="تسجيل العقد"
      editingSubmitButtonText="تحديث العقد"
      formComponents={formComponents}
      initialData={initialData}
    />
  );
}) satisfies React.FC<ContractFormModalProps>;

export default ContractFormModal;
