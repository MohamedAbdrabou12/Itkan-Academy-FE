import apiReq from "@/services/apiReq";
import type { AttendanceStatus } from "@/types/classes";
import type {
  StudentAttendanceReport,
  StudentEvaluationReport,
  EmployeeReportData,
  TeacherReportData,
  RevenueByBranchReportData,
  OutstandingTuitionReportData,
  TeacherPayrollReportData,
  StudentPaymentReportData,
} from "@/types/reports";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

export type ReportType =
  | "students/attendance"
  | "students/evaluations"
  | "teachers"
  | "staff"
  | "finance/revenue-by-branch"
  | "finance/outstanding-tuition"
  | "finance/teacher-payroll"
  | "finance/student-payments";

export type Report<T extends ReportType> = {
  type: T;
  data: (T extends "students/attendance"
    ? StudentAttendanceReport
    : T extends "students/evaluations"
      ? StudentEvaluationReport
      : T extends "teachers"
        ? TeacherReportData
        : T extends "staff"
          ? EmployeeReportData
          : T extends "finance/revenue-by-branch"
            ? RevenueByBranchReportData
            : T extends "finance/outstanding-tuition"
              ? OutstandingTuitionReportData
              : T extends "finance/teacher-payroll"
                ? TeacherPayrollReportData
                : T extends "finance/student-payments"
                  ? StudentPaymentReportData
                  : unknown)[];
};


export interface ReportGenerateRequest {
  type: ReportType;
  filters: {
    from: string;
    to: string;
    branch_ids?: string[];
    class_ids?: string[];
    student_ids?: string[];
    teacher_ids?: string[];
    staff_ids?: string[];
    attendance_status?: AttendanceStatus[];
  };
}

export const useGenerateReport = () => {
  const {
    data: report,
    mutate: generateReport,
    isPending,
  } = useMutation({
    mutationFn: async (
      params: ReportGenerateRequest,
    ): Promise<Report<ReportType>> => {
      const filterQuery = new URLSearchParams();
      filterQuery.append("from", params.filters.from);
      filterQuery.append("to", params.filters.to);

      for (const branch_id of params.filters.branch_ids ?? [])
        filterQuery.append("branch_ids", branch_id);

      for (const class_id of params.filters.class_ids ?? [])
        filterQuery.append("class_ids", class_id);

      for (const student_id of params.filters.student_ids ?? [])
        filterQuery.append("student_ids", student_id);

      for (const teacher_id of params.filters.teacher_ids ?? [])
        filterQuery.append("teacher_ids", teacher_id);

      for (const staff_id of params.filters.staff_ids ?? [])
        filterQuery.append("staff_ids", staff_id);

      for (const status of params.filters.attendance_status ?? [])
        filterQuery.append("attendance_status", status);

      return {
        type: params.type,
        data: await apiReq("GET", `/reports/${params.type}?${filterQuery}`),
      };
    },
    onSuccess: (res) => {
      return res;
    },
    onError: (err) => {
      toast(err.message, { type: "error" });
    },
  });

  return { report, generateReport, isPending };
};
