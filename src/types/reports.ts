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
