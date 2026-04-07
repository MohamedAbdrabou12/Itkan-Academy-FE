import type { FormComponents, FormField } from "@/types/Forms";
import {
  payrollRecordSchema,
  type PayrollRecordFormData,
} from "@/validation/payrollRecordSchema";
import { useMemo } from "react";
import { FormInput } from "../forms/FormInput";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";

interface PayrollRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PayrollRecordFormData) => Promise<void>;
  initialData?: PayrollRecordFormData;
  isSubmitting?: boolean;
  closeOnBackdropClick?: boolean;
}

const PayrollRecordFormModal = ((props: PayrollRecordFormModalProps) => {
  const initialData =
    props.initialData ??
    ({
      bonuses: "",
      deductions: "",
    } satisfies PayrollRecordFormData);

  const payrollRecordFields = useMemo(
    () =>
      [
        {
          name: "bonuses",
          label: "الزيادات",
          type: "number",
          required: true,
          placeholder: "0.00",
        },
        {
          name: "deductions",
          label: "الخصومات",
          type: "number",
          required: true,
          placeholder: "0.00",
        },
      ] satisfies FormField[],
    [],
  );

  const formComponents = {
    Input: FormInput,
    TextArea: FormTextArea,
    Select: FormSelect,
  } satisfies FormComponents;

  return (
    <GenericFormModal
      {...props}
      schema={payrollRecordSchema}
      fields={payrollRecordFields}
      title="تعديل سجل المرتب"
      description="املأ البيانات لتعديل المرتب"
      submitButtonText="تحديث المرتب"
      editingSubmitButtonText="تحديث المرتب"
      formComponents={formComponents}
      initialData={initialData}
    />
  );
}) satisfies React.FC<PayrollRecordFormModalProps>;

export default PayrollRecordFormModal;
