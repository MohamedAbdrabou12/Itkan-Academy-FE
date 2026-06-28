import type { AttendanceStatus, EvaluationGrade } from "./classes";

interface StudentReportBase {
  type: "attendance" | "evaluation";
  branch_id: number;
  branch_name: string;
  class_id: number;
  class_name: string;
  student_id: number;
  student_name: string;
  date: string;
}

export type StudentAttendanceReport = StudentReportBase & {
  type: "attendance";
  status: AttendanceStatus;
};

export type StudentEvaluationReport = StudentReportBase & {
  type: "evaluation";
  evaluation_grades: EvaluationGrade[] | undefined;
};

export interface EmployeeReportData {
  type: "staff" | "teacher";
  branch_id: number;
  branch_name: string;
  employee_id: number;
  employee_name: string;
  role_name: string;
  date: string;
  status: string;
  check_in?: string;
  check_out?: string;
  worked_minutes?: number;
  evaluation_score?: number;
  evaluator_name?: string;
}

export interface TeacherReportData extends EmployeeReportData {
  type: "teacher";
  classes: string;
}

export interface RevenueByBranchReportData {
  branch_id: number;
  branch_name: string;
  total_revenue: number;
  payment_count: number;
}

export interface OutstandingTuitionReportData {
  invoice_id: number;
  branch_id: number;
  branch_name: string;
  student_id: number;
  student_name: string;
  amount: number;
  due_date: string;
  status: string;
  description?: string;
}

export interface TeacherPayrollReportData {
  record_id: number;
  cycle_id: number;
  cycle_name: string;
  employee_id: number;
  employee_name: string;
  branch_names: string;
  base_salary: number;
  allowance: number;
  bonuses: number;
  deductions: number;
  net_salary: number;
}

export interface StudentPaymentReportData {
  payment_id: number;
  invoice_id: number;
  student_id: number;
  student_name: string;
  branch_name: string;
  amount: number;
  status: string;
  gateway?: string;
  external_txn_id?: string;
  paid_at?: string;
}


