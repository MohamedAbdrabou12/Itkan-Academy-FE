import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useGetAllCurriculums } from "@/hooks/curriculums/useGetAllCurriculums";
import { useCreateEnrolmentPricingPlan } from "@/hooks/enrolmentPricingPlans/useCreateEnrolmentPricingPlan";
import { useUpdateEnrolmentPricingPlan } from "@/hooks/enrolmentPricingPlans/useUpdateEnrolmentPricingPlan";
import {
  enrolmentPricingPlanSchema,
  type EnrolmentPricingPlanFormData,
  type EnrolmentPricingPlanFormInput,
} from "@/validation/enrolmentPricingPlanSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, type SubmitHandler } from "react-hook-form";
import HookFormInput from "../forms/HookFormInput";
import HookFormSelect from "../forms/HookFormSelect";
import { Modal } from "../shared/Modal";

interface EnrolmentPricingPlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialValues: (EnrolmentPricingPlanFormData & { id: number }) | null;
}

export const EnrolmentPricingPlanFormModal = ({
  isOpen,
  onClose,
  initialValues,
}: EnrolmentPricingPlanFormModalProps) => {
  const createMutation = useCreateEnrolmentPricingPlan();
  const updateMutation = useUpdateEnrolmentPricingPlan();

  const currentMonth = new Date().getMonth() + 1;
  const form = useForm<EnrolmentPricingPlanFormInput>({
    resolver: zodResolver(enrolmentPricingPlanSchema),
    mode: "onChange",
    defaultValues: {
      curriculum_id: "1",
      name: "",
      monthly_price: "0",
      start_month: currentMonth.toString(),
      end_month: (currentMonth + 1).toString(),
    },
  });

  function onCloseHandler() {
    onClose();
    form.reset();
  }

  const onSubmitHandler = async (data: EnrolmentPricingPlanFormData) => {
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
        curriculum_id: initialValues.curriculum_id,
        branch_id: initialValues.branch_id,
        name: initialValues.name,
        monthly_price: initialValues.monthly_price,
        start_month: initialValues.start_month,
        end_month: initialValues.end_month,
      });
    } else {
      form.reset({
        curriculum_id: "1",
        name: "",
        monthly_price: "0",
        start_month: currentMonth.toString(),
        end_month: (currentMonth + 1).toString(),
      });
    }
  }, [initialValues, form]);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const { curriculums } = useGetAllCurriculums({ page: 1, size: 100 });
  const { branches } = useGetAllBranches({ page: 1, size: 100 });

  const curriculumOptions = curriculums.map((curriculum) => ({
    value: curriculum.id.toString(),
    label: curriculum.name,
  }));
  const branchOptions = branches.map((branch) => ({
    value: branch.id.toString(),
    label: branch.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onCloseHandler}>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(
            onSubmitHandler as unknown as SubmitHandler<EnrolmentPricingPlanFormInput>,
          )}
        >
          <div className="grid grid-cols-1 gap-4">
            <HookFormSelect
              label="المنهج"
              name="curriculum_id"
              required
              options={curriculumOptions}
            />

            <HookFormSelect
              label="الفرع"
              name="branch_id"
              options={branchOptions}
            />

            <HookFormInput
              label="الاسم"
              name="name"
              placeholder="ادخل اسم الخطة"
              required
            />

            <HookFormInput
              label="المبلغ الشهري"
              name="monthly_price"
              type="number"
              placeholder="ادخل المبلغ الشهرى"
              required
            />

            <HookFormInput
              label="شهر بداية الدراسة"
              name="start_month"
              type="number"
              placeholder="ادخل شهر بداية الدراسة"
              required
              customInputProps={{ min: 1, max: 12 }}
            />

            <HookFormInput
              label="شهر نهاية الدراسة"
              name="end_month"
              type="number"
              placeholder="ادخل شهر نهاية الدراسة"
              required
              customInputProps={{ min: 1, max: 12 }}
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
