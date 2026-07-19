import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";

import { useGetAllEnrolmentPricingPlans } from "@/hooks/enrolmentPricingPlans/useGetAllEnrolmentPricingPlans";
import { useCreateEnrolment } from "@/hooks/enrolments/useCreateEnrolment";
import { useUpdateEnrolment } from "@/hooks/enrolments/useUpdateEnrolment";
import { useGetAllStudents } from "@/hooks/students/useGetAllStudents";
import {
  enrolmentSchema,
  type EnrolmentFormData,
  type EnrolmentFormInput,
} from "@/validation/enrolmentSchema";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";
import { Modal } from "../shared/Modal";

interface EnrolmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (EnrolmentFormData & { id: number }) | null;
}

export const EnrolmentFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: EnrolmentFormModalProps) => {
  const createMutation = useCreateEnrolment();
  const updateMutation = useUpdateEnrolment();

  const form = useForm<EnrolmentFormInput>({
    resolver: zodResolver(enrolmentSchema),
    mode: "onChange",
    defaultValues: {
      pricing_plan_id: '1',
      student_id: '1',
      months_paid: '1',
    },
  });

  const { students } = useGetAllStudents({ size: 100 });
  const studentOptions = students.map((student) => ({
    value: student.id.toString(),
    label: student.full_name,
  }));

  const { pricingPlans } = useGetAllEnrolmentPricingPlans({
    page: 1,
    size: 100,
  });
  const pricingPlanOptions = pricingPlans.map((plan) => ({
    value: plan.id.toString(),
    label: plan.name,
  }));

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: EnrolmentFormData) => {
    console.log(data);
    // 'data.is_active' is now exactly what was selected (boolean)
    if (initialValues) {
      await updateMutation.mutateAsync({ id: initialValues.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onCloseHandler();
  };

  useEffect(() => {
    if (initialValues) {
      form.reset({
        pricing_plan_id: initialValues.pricing_plan_id,
        student_id: initialValues.student_id,
        months_paid: initialValues.months_paid,
      });
    } else {
      form.reset({
        pricing_plan_id: '1',
        student_id: '1',
        months_paid: '1',
      });
    }
  }, [initialValues, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmitHandler as unknown as SubmitHandler<EnrolmentFormInput>,
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            <HookFormSelect
              label="الطالب"
              name="student_id"
              options={studentOptions}
              required
            />
            <HookFormSelect
              label="خطة الدفع"
              name="pricing_plan_id"
              options={pricingPlanOptions}
              required
            />

            <HookFormInput
              label="عدد الشهور المدفوعة"
              name="months_paid"
              type="number"
              customInputProps={{ min: 1, max: 12 }}
              required
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onCloseHandler}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? "جاري الحفظ..." : initialValues ? "حفظ" : "اضافة"}
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
