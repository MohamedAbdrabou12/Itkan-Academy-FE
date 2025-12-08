import { FormProvider, useForm, useWatch } from "react-hook-form";
import HookFormInput from "../forms/HookFormInput";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import HookFormSelect from "../forms/HookFormSelect";
import { Modal } from "../shared/Modal";
import type { ReportType } from "@/hooks/reports/useGenerateAttendanceReport";
import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useGetClassesByBranches } from "@/hooks/classes/useGetClassesByBranches";
import { useGetStudentsByClasses } from "@/hooks/students/useGetStudentsByClasses";
import { useEffect } from "react";

export interface GenerateReportFormData {
  type: ReportType;
  from: string;
  to: string;
  branch_ids: string[];
  class_ids: string[];
  student_ids: string[];
}

export interface GenerateReportFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateReportFormData) => void;
}

const GenerateReportFormModal = ({
  isOpen,
  onClose,
  onSubmit,
}: GenerateReportFormModalProps) => {
  const form = useForm<GenerateReportFormData>();

  useEffect(() => {
    form.setValue("type", "students/attendance");
    const date = new Date();
    form.setValue("to", date.toISOString().split("T")[0]);
    date.setMonth(date.getMonth() - 1);
    form.setValue("from", date.toISOString().split("T")[0]);
  }, [form]);

  const selectedBranches = useWatch({
    name: "branch_ids",
    control: form.control,
  }) as string[];

  const selectedClasses = useWatch({
    name: "class_ids",
    control: form.control,
  });

  const { branches } = useGetAllBranches();
  const { classes } = useGetClassesByBranches(selectedBranches);
  const { students } = useGetStudentsByClasses(selectedClasses);

  const branchesOptions = branches.map((branch) => ({
    value: branch.id.toString(),
    label: branch.name,
  }));

  const classesOptions =
    classes?.map((cls) => ({
      value: cls.id.toString(),
      label: cls.name,
    })) || [];

  const studentsOptions = students?.map((student) => ({
    value: student.id.toString(),
    label: student.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 gap-4">
            <HookFormSelect
              label="النوع"
              name="type"
              options={[
                { label: "الحضور", value: "students/attendance" },
                { label: "التقييمات", value: "students/evaluations" },
              ]}
              required
            />
            <HookFormInput type="date" label="من..." name="from" required />
            <HookFormInput type="date" label="إلى..." name="to" required />
            <HookFormMultiSelect
              label="الفروع"
              name="branch_ids"
              required
              options={branchesOptions}
              placeholder="اختر الفروع"
            />

            <HookFormMultiSelect
              label="الفصول"
              name="class_ids"
              disabled={!selectedBranches?.length}
              options={classesOptions}
              placeholder="اختر الفصول"
            />

            <HookFormMultiSelect
              label="الطلاب"
              name="student_ids"
              disabled={!selectedClasses?.length}
              options={studentsOptions}
              placeholder="اختر الطلاب"
            />

            <button
              type="submit"
              className="cursor-pointer items-center space-x-2 rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
            >
              تكوين التقرير
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
export default GenerateReportFormModal;
