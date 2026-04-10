import type { FormComponents, FormField } from "@/types/Forms";
import { PayrollCycleStatus } from "@/types/PayrollCycle";
import {
  payrollCycleEditSchema,
  type PayrollCycleEditFormData,
} from "@/validation/payrollCycleSchema";
import { useMemo } from "react";
import { FormInput } from "../forms/FormInput";
import { FormSelect } from "../forms/FormSelect";
import { FormTextArea } from "../forms/FormTextArea";
import { GenericFormModal } from "./GenericFormModal";

interface PayrollCycleEditFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: PayrollCycleEditFormData;
  onSubmit: (data: PayrollCycleEditFormData) => Promise<void>;
  isSubmitting?: boolean;
  closeOnBackdropClick?: boolean;
}

const PayrollCycleEditFormModal = ((
  props: PayrollCycleEditFormModalProps,
) => {
  const payrollCycleFields = useMemo(
    () =>
      [
        {
          name: "status",
          label: "الحالة",
          type: "select",
          required: true,
          options: [
            {
              value: PayrollCycleStatus.DRAFT,
              label: "الافتراضية",
            },
            {
              value: PayrollCycleStatus.LOCKED,
              label: "فى انتظار القبول",
            },
            {
              value: PayrollCycleStatus.APPROVED,
              label: "مقبولة",
            },
            {
              value: PayrollCycleStatus.PAID,
              label: "مدفوعة",
            },
          ],
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
      schema={payrollCycleEditSchema}
      fields={payrollCycleFields}
      title="تعديل حالة الدورة"
      description="املأ البيانات لتعديل حالة الدورة"
      editingSubmitButtonText="تحديث الدورة"
      submitButtonText=""
      isEditing
      formComponents={formComponents}
      initialData={props.initialData}
    />
  );
}) satisfies React.FC<PayrollCycleEditFormModalProps>;

export default PayrollCycleEditFormModal;
