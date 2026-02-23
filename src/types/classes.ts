import type { ClassFormData } from "@/validation/classSchema";
import type { Subject } from "./subjects";

export type Weekday =
  | "saturday"
  | "sunday"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday";
export type ClassSchedule = Record<Weekday, string[]>;

export interface Class {
  id: number;
  branch_id: string;
  name: string;
  schedule: ClassSchedule;
  evaluation_config: string[];
  curriculum_id: number;
  subject_id: number;
  subject: Subject;
  created_at: string;
  updated_at: string;
  [key: string]: unknown; // index signature
}

export interface ClassStudent {
  student_id: number;
  full_name: string;
}

export interface EvaluationGrade {
  name: string;
  grade: number;
}

export enum AttendanceStatus {
  PRESENT = "present",
  ABSENT = "absent",
  LATE = "late",
  EXCUSED = "excused",
}

export interface StudentAttendanceStatus {
  attendance_status: AttendanceStatus;
  notes: string;
  evaluations: EvaluationGrade[] | null;
}

export type AttendanceStatusMap = Record<number, StudentAttendanceStatus>;

export interface Evaluation {
  id: number;
  student_id: number;
  class_id: number;
  date: string;
  unit_item_id: number;
  unit_item_title: string;
  unit_item_content: string;
  attendance_status: AttendanceStatus;
  evaluation_grades: EvaluationGrade[];
  notes?: string;
  created_at: string;
}

export interface ClassRead {
  id: number;
  branch_id: number;
  name: string;
  schedule?: Record<string, unknown>;
  status: "active" | "deactive";
  created_at: string;
  updated_at: string;
}

export interface ClassResponse {
  items: Class[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface AddClassRequest extends Omit<ClassFormData, "schedule"> {
  schedule: {
    [key: string]: string[];
  };
}
