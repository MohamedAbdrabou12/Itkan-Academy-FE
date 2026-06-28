import { PermissionKeys } from "@/constants/permissions";
import { usePermissionsGate } from "@/hooks/auth/usePermissionGate";
import { useGetCurrentUserBranches } from "@/hooks/branches/useGetCurrentUserBranches";
import { useGetClassesByBranches } from "@/hooks/classes/useGetClassesByBranches";
import type { ReportType } from "@/hooks/reports/useGenerateReport";
import { useGetStudentsByClasses } from "@/hooks/students/useGetStudentsByClasses";
import { useGetAllTeachers } from "@/hooks/teachers/useGetAllTeachers";
import { useGetAllStaff } from "@/hooks/staff/useGetStaff";
import { AttendanceStatus } from "@/types/classes";
import { attendanceStatusDisplayNames } from "@/utils/attendanceStatusDisplayNames";
import { useEffect, useMemo } from "react";
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
  teacher_ids: string[];
  staff_ids: string[];
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
  const { can } = usePermissionsGate();
  const form = useForm<GenerateReportFormData>();

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

  const { branches } = useGetCurrentUserBranches();
  const { classes } = useGetClassesByBranches(selectedBranches);
  const { students } = useGetStudentsByClasses(selectedClasses);
  const { teachers } = useGetAllTeachers({ size: 100 });
  const { staff } = useGetAllStaff({ size: 100 });

  const reportTypeOptions = useMemo(() => {
    return [
      {
        label: "تقرير التقييمات",
        value: "students/evaluations",
        permission: PermissionKeys.REPORTS_EVALUATIONS_VIEW,
      },
      {
        label: "تقرير الحضور",
        value: "students/attendance",
        permission: PermissionKeys.REPORTS_ATTENDANCE_VIEW,
      },
      {
        label: "تقرير المعلمين",
        value: "teachers",
        permission: PermissionKeys.REPORTS_TEACHERS_VIEW,
      },
      {
        label: "تقرير الموظفين",
        value: "staff",
        permission: PermissionKeys.REPORTS_STAFF_VIEW,
      },
      {
        label: "إيرادات الفروع",
        value: "finance/revenue-by-branch",
        permission: PermissionKeys.REPORTS_FINANCE_VIEW,
      },
      {
        label: "الرسوم الدراسية المستحقة",
        value: "finance/outstanding-tuition",
        permission: PermissionKeys.REPORTS_FINANCE_VIEW,
      },
      {
        label: "رواتب المعلمين",
        value: "finance/teacher-payroll",
        permission: PermissionKeys.REPORTS_FINANCE_VIEW,
      },
      {
        label: "سجل مدفوعات الطلاب",
        value: "finance/student-payments",
        permission: PermissionKeys.REPORTS_FINANCE_VIEW,
      },
    ];
  }, []);

  const allowedReportOptions = reportTypeOptions.filter((option) =>
    can([option.permission]),
  );

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

  const teachersOptions = useMemo(() => {
    if (!teachers) return [];
    let filtered = teachers;
    if (selectedBranches?.length) {
      filtered = filtered.filter((t) =>
        t.branch_ids?.some((bid) => selectedBranches.includes(bid.toString())),
      );
    }
    if (selectedClasses?.length) {
      filtered = filtered.filter((t) =>
        t.class_ids?.some((cid) => selectedClasses.includes(cid.toString())),
      );
    }
    return filtered.map((t) => ({
      value: t.id.toString(),
      label: t.full_name,
    }));
  }, [teachers, selectedBranches, selectedClasses]);

  const staffOptions = useMemo(() => {
    if (!staff) return [];
    let filtered = staff;
    if (selectedBranches?.length) {
      filtered = filtered.filter((s) =>
        s.branch_ids?.some((bid) => selectedBranches.includes(bid.toString())),
      );
    }
    return filtered.map((s) => ({
      value: s.id.toString(),
      label: s.full_name,
    }));
  }, [staff, selectedBranches]);

  const attendanceStatusOptions = Object.values(AttendanceStatus).map(
    (status) => ({
      value: status,
      label: attendanceStatusDisplayNames[status],
    }),
  );

  useEffect(() => {
    form.setValue("type", reportTypeOptions[0]?.value as ReportType);
    const date = new Date();
    form.setValue("to", date.toISOString().split("T")[0]);
    date.setMonth(date.getMonth() - 1);
    form.setValue("from", date.toISOString().split("T")[0]);
  }, [form, reportTypeOptions]);

  const todayISODate = new Date().toISOString().split("T")[0];

  return (
    <Modal isOpen={isOpen} onClose={onClose} modalStyle="min-w-[40%]">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <HookFormSelect
                label="نوع التقرير"
                name="type"
                options={allowedReportOptions}
                required
              />
              <HookFormInput
                type="date"
                label="من..."
                name="from"
                required
                customInputProps={{ max: todayISODate }}
              />
              <HookFormInput
                type="date"
                label="إلى..."
                name="to"
                required
                customInputProps={{ max: todayISODate }}
              />
            </div>

            <div>
              {/* Attendance and Evaluations Options */}
              {selectedReportType?.startsWith("students") && (
                <>
                  <HookFormMultiSelect
                    label="الفروع"
                    name="branch_ids"
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

              {selectedReportType === "teachers" && (
                <>
                  <HookFormMultiSelect
                    label="الفروع"
                    name="branch_ids"
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
                    label="المعلمين"
                    name="teacher_ids"
                    disabled={!selectedBranches?.length}
                    options={teachersOptions}
                    placeholder="اختر المعلمين"
                  />
                </>
              )}

              {selectedReportType === "staff" && (
                <>
                  <HookFormMultiSelect
                    label="الفروع"
                    name="branch_ids"
                    options={branchesOptions}
                    placeholder="اختر الفروع"
                  />
                  <HookFormMultiSelect
                    label="الموظفين"
                    name="staff_ids"
                    disabled={!selectedBranches?.length}
                    options={staffOptions}
                    placeholder="اختر الموظفين"
                  />
                </>
              )}

              {selectedReportType === "finance/revenue-by-branch" && (
                <>
                  <HookFormMultiSelect
                    label="الفروع"
                    name="branch_ids"
                    options={branchesOptions}
                    placeholder="اختر الفروع"
                  />
                </>
              )}

              {(selectedReportType === "finance/outstanding-tuition" ||
                selectedReportType === "finance/student-payments") && (
                <>
                  <HookFormMultiSelect
                    label="الفروع"
                    name="branch_ids"
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
                </>
              )}

              {selectedReportType === "finance/teacher-payroll" && (
                <>
                  <HookFormMultiSelect
                    label="الفروع"
                    name="branch_ids"
                    options={branchesOptions}
                    placeholder="اختر الفروع"
                  />
                  <HookFormMultiSelect
                    label="المعلمين"
                    name="teacher_ids"
                    disabled={!selectedBranches?.length}
                    options={teachersOptions}
                    placeholder="اختر المعلمين"
                  />
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

