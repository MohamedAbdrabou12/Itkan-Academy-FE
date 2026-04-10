import type { FormComponents, FormField } from "@/types/Forms";
import {
  payrollCycleGenerateSchema,
  type PayrollCycleGenerateFormData,
} from "@/validation/payrollCycleSchema";
import { useMemo } from "react";
import { FormInput } from "../forms/FormInput";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";

interface PayrollCycleGenerateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PayrollCycleGenerateFormData) => Promise<void>;
  isSubmitting?: boolean;
  closeOnBackdropClick?: boolean;
}

const PayrollCycleGenerateFormModal = ((
  props: PayrollCycleGenerateFormModalProps,
) => {
  const initialData: PayrollCycleGenerateFormData = {
    month: "",
    year: "",
  };

  const payrollCycleFields = useMemo(
    () =>
      [
        {
          name: "month",
          label: "الشهر",
          type: "number",
          required: true,
          placeholder: (new Date().getMonth() + 1).toString(),
        },
        {
          name: "year",
          label: "السنة",
          type: "number",
          required: true,
          placeholder: new Date().getFullYear().toString(),
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
      schema={payrollCycleGenerateSchema}
      fields={payrollCycleFields}
      title="تكوين دورة جديدة"
      description="املأ البيانات لتكوين دورة جديدة"
      submitButtonText="تكوين الدورة"
      editingSubmitButtonText=""
      formComponents={formComponents}
      initialData={initialData}
    />
  );
}) satisfies React.FC<PayrollCycleGenerateFormModalProps>;

export default PayrollCycleGenerateFormModal;
