import { useGetAllBranches } from "@/hooks/branches/useGetAllBranches";
import { useGetClassesByBranches } from "@/hooks/classes/useGetClassesByBranches";
import type { ReportType } from "@/hooks/reports/useGenerateReport";
import { useGetStudentsByClasses } from "@/hooks/students/useGetStudentsByClasses";
import { AttendanceStatus } from "@/types/classes";
import { attendanceStatusDisplayNames } from "@/utils/attendanceStatusDisplayNames";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import HookFormInput from "../forms/HookFormInput";
import HookFormMultiSelect from "../forms/HookFormMultiSelect";
import HookFormSelect from "../forms/HookFormSelect";
import { Modal } from "../shared/Modal";

export interface GenerateReportFormData {
  type: ReportType;
  from: string;
  to: string;
  branch_ids: string[];
  class_ids: string[];
  student_ids: string[];
  attendance_status: AttendanceStatus[];
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

  const selectedReportType = useWatch({
    name: "type",
    control: form.control,
  }) as ReportType;

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

  const reportTypeOptions = [
    { label: "تقرير الحضور", value: "students/attendance" },
    { label: "تقرير التقييمات", value: "students/evaluations" },
  ];

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

  const attendanceStatusOptions = Object.values(AttendanceStatus).map(
    (status) => ({
      value: status,
      label: attendanceStatusDisplayNames[status],
    }),
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <HookFormSelect
                label="نوع التقرير"
                name="type"
                options={reportTypeOptions}
                required
              />
              <HookFormInput type="date" label="من..." name="from" required />
              <HookFormInput type="date" label="إلى..." name="to" required />
            </div>

            <div>
              {/* Attendance and Evaluations Options */}
              {selectedReportType?.startsWith("students") && (
                <>
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
                  {selectedReportType == "students/attendance" && (
                    <HookFormMultiSelect
                      label="حالة الحضور"
                      name="attendance_status"
                      options={attendanceStatusOptions}
                      placeholder="اختر الحالة"
                    />
                  )}
                </>
              )}
            </div>

            <button type="submit" className="btn-primary col-span-full">
              إنشاء التقرير
            </button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};
export default GenerateReportFormModal;
